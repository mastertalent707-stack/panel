use super::State;
use utoipa_axum::{router::OpenApiRouter, routes};

mod get {
    use serde::Serialize;
    use shared::{
        ApiError, GetState,
        models::{node::GetNode, user::GetPermissionManager},
        response::{ApiResponse, ApiResponseResult},
    };
    use utoipa::ToSchema;

    #[derive(ToSchema, Serialize)]
    struct Response {
        config: wings_api::Config,
    }

    #[utoipa::path(get, path = "/", responses(
        (status = OK, body = inline(Response)),
        (status = BAD_REQUEST, body = ApiError),
    ))]
    pub async fn route(
        state: GetState,
        permissions: GetPermissionManager,
        node: GetNode,
    ) -> ApiResponseResult {
        permissions.has_admin_permission("nodes.read")?;

        let config = node.fetch_configuration(&state.database).await?;

        ApiResponse::new_serialized(Response { config }).ok()
    }
}

mod patch {
    use serde::Serialize;
    use shared::{
        ApiError, GetState,
        models::{
            admin_activity::GetAdminActivityLogger, node::GetNode, user::GetPermissionManager,
        },
        response::{ApiResponse, ApiResponseResult},
    };
    use utoipa::ToSchema;

    #[derive(ToSchema, Serialize)]
    struct Response {
        applied: bool,
    }

    fn strip_paths(value: &mut serde_json::Value, paths: &[&str]) {
        for path in paths {
            let mut cursor = &mut *value;
            let mut parts = path.split('.').peekable();

            while let Some(part) = parts.next() {
                let serde_json::Value::Object(map) = cursor else {
                    break;
                };

                if parts.peek().is_none() {
                    map.remove(part);
                    break;
                }

                match map.get_mut(part) {
                    Some(next) => cursor = next,
                    None => break,
                }
            }
        }
    }

    #[utoipa::path(patch, path = "/", responses(
        (status = OK, body = inline(Response)),
        (status = BAD_REQUEST, body = ApiError),
    ), request_body = serde_json::Value)]
    pub async fn route(
        state: GetState,
        permissions: GetPermissionManager,
        node: GetNode,
        activity_logger: GetAdminActivityLogger,
        shared::Payload(mut data): shared::Payload<serde_json::Value>,
    ) -> ApiResponseResult {
        permissions.has_admin_permission("nodes.update")?;

        const FORBIDDEN_PATHS: &[&str] = &[
            "uuid",
            "token",
            "token_id",
            "remote",
            "remote_headers",
            "system.root_directory",
            "system.log_directory",
            "system.vmount_directory",
            "system.data",
            "system.archive_directory",
            "system.backup_directory",
            "system.tmp_directory",
            "system.passwd.directory",
            "system.backups.restic.repository",
            "system.backups.restic.password_file",
            "system.backups.mounting.path",
            "system.username",
            "system.user",
            "system.passwd",
            "docker.socket",
            "allowed_mounts",
        ];

        strip_paths(&mut data, FORBIDDEN_PATHS);

        let applied = node.update_configuration(&state.database, &data).await?;

        activity_logger
            .log(
                "node:update-config",
                serde_json::json!({
                    "uuid": node.uuid,
                    "config": data,
                }),
            )
            .await;

        ApiResponse::new_serialized(Response { applied }).ok()
    }
}

pub fn router(state: &State) -> OpenApiRouter<State> {
    OpenApiRouter::new()
        .routes(routes!(get::route))
        .routes(routes!(patch::route))
        .with_state(state.clone())
}
