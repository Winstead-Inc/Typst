#![allow(non_snake_case)]
fn main()
{
    if let Ok(Target) = std::env::var("TARGET")
    {
        println!("cargo:rustc-env=TYPST_STUDIO_TARGET={}", Target);
    }
    tauri_build::build()
}
