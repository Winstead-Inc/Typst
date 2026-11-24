use std::io::Write;
use std::path::Path;
use std::process::ExitCode;
use std::sync:: { Arc, LazyLock };

use clap::Parser;
use rayon::iter:: { IntoParallelRefIterator, ParallelIterator };
use typst::diag:: { At, SourceResult, Warned };
use typst::foundations::Bytes;
use typst::syntax::Span;
use typst_bundle:: { Bundle, BundleFile, BundleOptions, VirtualFs };
use typst_docs::args:: { CliArguments, Command, CompileCommand, Config, OutputFormat, WatchCommand, };
use typst_docs::search;
use typst_docs::world::DocWorld;
use typst_kit::diagnostics:: { self, termcolor };
use typst_kit::timer::Timer;
use typst_kit::watcher::Watcher;
use typst_layout::PagedDocument;
use typst_pdf::PdfOptions;

/// The parsed command line arguments.
static ARGS: LazyLock<CliArguments> = LazyLock:: new (CliArguments::parse);

/// Entry point.
fn main() -> ExitCode
{ match & ARGS.command { Command::Compile(command) => compile(command), Command::Watch(command) => watch(command), } }

/// Execute a compilation command.
fn compile(command: & CompileCommand) -> ExitCode
{
    let mut timer = Timer::new_or_placeholder(command.args.timings.clone());
    let mut config = Config:: new ( & command.args, false);
    let mut world = DocWorld:: new ( & config);
    let report = timer
   . record( & mut world, | world | compile_once(world, & mut config))
   .unwrap();
    report.print( & world);

    if report.0 .output.is_err()
    || (command.deny_warnings && ! report.0 .warnings.is_empty())
    { return ExitCode::FAILURE; }

    ExitCode::SUCCESS
}

/// Execute a watching compilation command.
fn watch(command: & WatchCommand) -> !
{
    let mut timer = Timer::new_or_placeholder(command.args.timings.clone());
    let mut watcher = Watcher:: new (None).unwrap();
    let mut config = Config:: new ( & command.args, ! command.no_serve);
    let mut world = DocWorld:: new ( & config);

    loop
    {
        print_watch_header( & config);
        writeln!(out(), "compiling ...").unwrap();
        let report = timer
       . record( & mut world, | world | compile_once(world, & mut config))
       .unwrap();

        print_watch_header( & config);
        report.print( & world);

        comemo::evict(10);
        watcher.update(world.dependencies()).unwrap();
        watcher.wait().unwrap();
        world.reset();
    }
}

/// Prints the status line in watch mode.
fn print_watch_header(config: & Config)
{
    let mut out = out();
    let clear = "\x1B[2J\x1B[1;1H";
    write!(out, "{clear}").unwrap();
    if let Some(server) = & config.server
    { writeln ! (out, "serving docs on http://{}", server.addr()).unwrap(); writeln ! (out).unwrap(); }
    if let Some(path) = & config.output
    { writeln ! (out, "writing to {}", path.display()).unwrap(); writeln ! (out).unwrap(); }
}

/// Compiles the documentation, potentially writing it to disk and/or updating
/// the live reload server, and returns compilation diagnostics ready for
/// printing.
fn compile_once(world: & DocWorld, config: & mut Config) -> Report
{
    let mut warned = match config.output_format
    {
        OutputFormat::Website => typst::compile::<Bundle>(world)
       .and_then( | bundle | export_website(bundle, config)),
        OutputFormat::Pdf => typst::compile::<PagedDocument>(world)
       .and_then( | document | export_pdf( & document, config)),
    };

    if config.open && warned.output.is_ok()
    {
        if let Some(server) = & config.server
        { let url = format ! ("http://{}", server.addr()); open::that_detached(url).unwrap(); }
        else if let Some(output) = & config.output
        { open::that_detached(output).unwrap(); }
        config.open = false;
    }

    warned
   .warnings
   .retain( | diag | ! diag.message.starts_with("bundle export is experimental"));

    Report(warned)
}

/// Exports the built website, adding a search index, and refreshes the live
/// reload server.
fn export_website(mut bundle: Bundle, config: & Config) -> Warned < SourceResult < () >>
{
    Warned::from(Ok(()))
   .and_then
    (
        | () |
        {
            let index = search::build_search_index( & bundle)?;
            let search_path = search::index_path( & bundle).at(Span::detached())?;
            Arc::make_mut( & mut bundle.files).insert(search_path, BundleFile::Asset(Bytes::new (serde_json::to_vec( & index).unwrap())),);

            Ok(BundleOptions::default ())
        }
    )
   .and_then( | options | typst_bundle::export( & bundle, & options))
   .and_then
    (
        | fs |
        {
            if let Some(path) = & config.output
            { write_virtual_fs(path, & fs); }

            if let Some(server) = & config.server
            { server.set_bundle(bundle, fs); }

            Ok(())
        }
    )
}

/// Writes a bundle's files to disk.
fn write_virtual_fs(root: & Path, fs: & VirtualFs)
{
    std::fs::create_dir_all(root).unwrap();
    fs.par_iter().for_each
    (
        | (path, data) |
        {
            let realized = path.realize(root).unwrap();
            if let Some(parent) = realized.parent()
            { std::fs::create_dir_all(parent).unwrap(); }
            std::fs::write( & realized, data).unwrap();
        }
    );
}

/// Exports a document to PDF and writes it to disk.
fn export_pdf(document: & PagedDocument, config: & Config) -> Warned < SourceResult < () >>
{
    typst_pdf::pdf(document, & PdfOptions::default ()).and_then
    (
        | data |
        {
            if let Some(path) = & config.output
            {
                if let Some(parent) = path.parent()
                { std::fs::create_dir_all(parent).unwrap(); }
                std::fs::write(path, data).unwrap();
            }
            Ok(())
        }
    )
}

/// Acquires the output stream for user-facing messages.
fn out() -> termcolor::StandardStream
{ termcolor::StandardStream::stderr(termcolor::ColorChoice::Auto) }

/// Holds diagnostics, ready for printing.
struct Report(Warned < SourceResult < () >>);

impl Report
{
    /// Prints the diagnostics.
    fn print( & self, world: & DocWorld)
    {
        let Warned { output, warnings }
        = & self.0;
        let errors = output.as_ref().err().map( | v | v.as_slice()).unwrap_or_default();
        diagnostics::emit( & mut out(), world, errors.iter().chain(warnings), diagnostics::DiagnosticFormat::Human,)
       .unwrap();
    }
}
