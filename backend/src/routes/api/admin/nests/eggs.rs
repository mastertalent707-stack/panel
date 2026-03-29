use super::State;
use utoipa_axum::{router::OpenApiRouter, routes};

mod get {
    use futures_util::{StreamExt, TryStreamExt};
    use serde::Serialize;
    use shared::{
        GetState,
        models::{nest_egg::NestEgg, user::GetPermissionManager},
        response::{ApiResponse, ApiResponseResult},
    };
    use std::collections::BTreeMap;
    use utoipa::ToSchema;

    #[derive(ToSchema, Serialize)]
    struct Response {
        nest_eggs: BTreeMap<uuid::Uuid, Vec<shared::models::nest_egg::AdminApiNestEgg>>,
    }

    #[utoipa::path(get, path = "/", responses(
        (status = OK, body = inline(Response)),
    ))]
    pub async fn route(state: GetState, permissions: GetPermissionManager) -> ApiResponseResult {
        permissions.has_admin_permission("eggs.read")?;

        let nest_eggs = NestEgg::all(&state.database).await?;

        let mut futures_map = BTreeMap::new();
        for nest_egg in nest_eggs {
            futures_map
                .entry(nest_egg.nest.uuid)
                .or_insert_with(Vec::new)
                .push(nest_egg.into_admin_api_object(&state.database));
        }

        let mut map = BTreeMap::new();
        for (nest_uuid, futures) in futures_map {
            let eggs = futures_util::stream::iter(futures)
                .buffered(25)
                .try_collect::<Vec<_>>()
                .await?;

            map.insert(nest_uuid, eggs);
        }

        ApiResponse::new_serialized(Response { nest_eggs: map }).ok()
    }
}

pub fn router(state: &State) -> OpenApiRouter<State> {
    OpenApiRouter::new()
        .routes(routes!(get::route))
        .with_state(state.clone())
}
