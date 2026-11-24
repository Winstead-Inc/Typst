use std::path:: { Path, PathBuf };

use clap::builder::ValueParser;
use clap:: { ArgAction, Parser, Subcommand, ValueEnum };
use typst_kit::server::HttpServer;
use typst_utils:: { display_possible_values, parse_sys_input_pair };

/// Generator for Typst's documentation.
#[derive(Debug, Clone, Parser)]
#[command(bin_name = "cargo docit")]
#[clap(name = "typst-docs", author)]
pub struct CliArguments
{
    /// The command to run.
    #[command(subcommand)]
    pub command: Command,
}

/// What to do.
#[derive(Debug, Clone, Subcommand)]
#[command()]
pub enum Command
{
    /// Compiles the documentation into a directory on-disk.
    ///
    /// - When exporting to a website, the output is written to `docs/dist/site`
    /// - When exporting to a PDF, the output is written to `docs/dist/docs.pdf`
   #[command(visible_alias = "c")]
    Compile(CompileCommand),
    /// Compiles the documentation continuously.
    ///
    /// - When exporting to a website, serves on a live-reload server instead of
    ///   writing to disk.
    /// - When exporting to a PDF, writes to disk.
    #[command(visible_alias = "w")]
    Watch(WatchCommand),
}

/// Compiles the documentation into a directory on-disk.
#[derive(Debug, Clone, Parser)]
pub struct CompileCommand
{
    /// Arguments for compilation.
    #[clap(flatten)]
    pub args: CompileArgs,
    /// Whether to exit with an error code if there were warnings.
    #[arg(long)]
    pub deny_warnings: bool,
}

/// Compiles the documentation continuously.
#[derive(Debug, Clone, Parser)]
pub struct WatchCommand
{
    /// Arguments for compilation.
    #[clap(flatten)]
    pub args: CompileArgs,

    /// Whether to emit the files when the source changes, instead of serving them.
    #[arg(long)]
    pub no_serve: bool,
}

/// Arguments for compilation and watching.
#[derive(Debug, Clone, Parser)]
pub struct CompileArgs
{
    /// Path to main file.
    ///
    /// If not present, uses the provided default entrypoint in
    /// `docs/main.typ` in the workspace. Can be customized to consume the
    /// docs as a Typst package. The package is available as `@typst/docs:0.0.0`.
    pub input: Option<PathBuf>,
    /// Path to the output file or directory.
    ///
    /// Defaults to
    /// - `docs/dist/docs.pdf` for the PDF version.
    /// - `docs/dist/site/**` for the HTML version (or nothing at all when
    ///   watching).
    ///
    /// The default values are relative to the workspace.
    #[arg(verbatim_doc_comment)]
    pub output: Option<PathBuf>,
    /// The output format.
    #[arg(long = "format", short = 'f', default_value_t)]
    pub format: OutputFormat,
    /// Add a string key-value pair visible through `sys.inputs`.
    #[clap(short = 'i', long = "input", value_name = "key=value", action = ArgAction::Append, value_parser = ValueParser::new (parse_sys_input_pair),)]
    pub inputs: Vec < (String, String) > ,
    /// Do not add the "development version" warning to the generated PDF.
    #[arg(long)]
    pub release: bool,
    /// Produces performance timings of the compilation process.
    #[arg(long = "timings", value_name = "OUTPUT_JSON")]
    pub timings: Option<PathBuf>,
    /// Open the generated output when finished.
    #[arg(long)]
    pub open: bool,
    /// Path to the workspace from which to load files for documentation.
    ///
    /// This program generates documentation from Typst's codebase. By default,
    /// it loads the workspace in which it was compiled. Once compiled, this
    /// program may be reused to generate documentation for another clone of the
    /// codebase. To do so, set this option to that clone's root directory.
    ///
    /// The default INPUT and OUTPUT are relative to the value of this option.
    #[arg(long)]
    pub workspace: Option<PathBuf>,
}

/// Which kind of output to generate.
#[derive(Debug, Default, Copy, Clone, Eq, PartialEq, ValueEnum)]
pub enum OutputFormat {#[default] Website, Pdf, }

display_possible_values!(OutputFormat);

/// The default entrypoint into the docs.
pub const ENTRYPOINT: &str = "docs/main.typ";

// Paths.
pub const PDF_PATH: &str = "docs/dist/docs.pdf";
pub const SITE_PATH: &str = "docs/dist/site";

/// Preprocessing configuration for compilation.
pub struct Config
{
    /// Path to the input Typst file.
    pub input: PathBuf,
    /// The workspace from which to load files for documentation, i.e.
    /// `@typst/repo` and `@typst/docs` packages.
    pub workspace: PathBuf,
    /// The output path to which the compilation output is written.
    /// If `None`, nothing should be written (e.g., HTML watching).
    pub output: Option<PathBuf>,
    /// The kind of output to produce.
    pub output_format: OutputFormat,
    /// String key-value pairs visible through `sys.inputs`.
    pub sys_inputs: Vec<(String, String)>,
    /// Whether to include a "development version" warning in the documentation.
    pub is_dev_version: bool,
    /// A live reload server for the `watch` subcommand.
    pub server: Option<HttpServer>,
    /// Whether to open the output after compilation.
    pub open: bool,
}

impl Config
{
    /// Preprocess `CompileArgs`, producing a compilation config.
    pub fn new(args: &CompileArgs, serve: bool) -> Self
    {
        let workspace = args.workspace.clone().unwrap_or_else
        (
            ||
            {
                // Default to the workspace in which this program was compiled.
                Path::new(env!("CARGO_MANIFEST_DIR")).join(std::path::Component::ParentDir)
            }
        );

        Self
        {
            input: args.input.clone().unwrap_or(workspace.join(ENTRYPOINT)),
            output: args.output.clone().or_else
            (
                || match args.format
                {
                    OutputFormat::Pdf => Some(workspace.join(PDF_PATH)),
                    OutputFormat::Website if serve => None,
                    OutputFormat::Website => Some(workspace.join(SITE_PATH)),
                }
            ),
            workspace,
            output_format: args.format,
            sys_inputs: args.inputs.clone(),
            is_dev_version: !args.release,
            server: (serve && args.format == OutputFormat::Website)
                .then(|| HttpServer::new("docs", None, true).unwrap()),
            open: args.open,
        }
    }
}
