use shared::extensions::commands::CliCommandGroupBuilder;

mod create;
mod migrate;
mod status;
mod version;

pub fn commands(cli: CliCommandGroupBuilder) -> CliCommandGroupBuilder {
    cli.add_command(
        "status",
        "Shows the current status of database migrations.",
        status::StatusCommand,
    )
    .add_command(
        "migrate",
        "Applies pending database migrations.",
        migrate::MigrateCommand,
    )
    .add_command(
        "create",
        "Creates a new database migration for an extension.",
        create::CreateCommand,
    )
    .add_command(
        "version",
        "Prints the current executable version and exits.",
        version::VersionCommand,
    )
}
