use super::State;
use axum::{body::Body, extract::Request, http::StatusCode, routing::any};
use shared::{
    GetIp, GetState,
    models::{node::GetNode, user::GetPermissionManager},
    response::ApiResponse,
};
use utoipa_axum::router::OpenApiRouter;

pub fn router(state: &State) -> OpenApiRouter<State> {
    OpenApiRouter::new()
        .route(
            "/",
            any(
                |state: GetState,
                 permissions: GetPermissionManager,
                 node: GetNode,
                 ip: GetIp,
                 mut req: Request| async move {
                    permissions.has_admin_permission("nodes.read")?;

                    let is_upgrade = req
                        .headers()
                        .get(axum::http::header::UPGRADE)
                        .is_some_and(|v| v.as_bytes().eq_ignore_ascii_case(b"websocket"));
                    if !is_upgrade {
                        return ApiResponse::error("expected a websocket upgrade")
                            .with_status(StatusCode::BAD_REQUEST)
                            .ok();
                    }

                    let on_upgrade = hyper::upgrade::on(&mut req);
                    let (parts, body) = req.into_parts();

                    let url = node.url("/api/system/stats/ws");
                    let token = state.database.decrypt(node.0.token).await?;

                    let mut request = reqwest::Request::new(parts.method, url);
                    *request.headers_mut() = parts.headers;
                    *request.body_mut() = Some(reqwest::Body::wrap_stream(body.into_data_stream()));

                    request.headers_mut().remove(axum::http::header::HOST);
                    request.headers_mut().remove("X-Forwarded-For");
                    request
                        .headers_mut()
                        .insert("X-Real-Ip", ip.to_string().parse()?);
                    request.headers_mut().insert(
                        axum::http::header::AUTHORIZATION,
                        format!("Bearer {token}").parse()?,
                    );

                    let response = match tokio::time::timeout(
                        std::time::Duration::from_secs(30),
                        state.client.execute(request),
                    )
                    .await
                    {
                        Ok(Ok(response)) => response,
                        Ok(Err(_)) => {
                            return ApiResponse::error("failed to connect to upstream")
                                .with_status(StatusCode::BAD_GATEWAY)
                                .ok();
                        }
                        Err(_) => {
                            return ApiResponse::error("upstream request timed out")
                                .with_status(StatusCode::GATEWAY_TIMEOUT)
                                .ok();
                        }
                    };

                    let status = response.status();
                    let headers = response.headers().clone();

                    if status != StatusCode::SWITCHING_PROTOCOLS {
                        return ApiResponse::new(Body::from_stream(response.bytes_stream()))
                            .with_status(status)
                            .with_headers(&headers)
                            .ok();
                    }

                    tokio::spawn(async move {
                        let (client_stream_raw, mut upstream_stream) =
                            match tokio::join!(on_upgrade, response.upgrade()) {
                                (Ok(c), Ok(u)) => (c, u),
                                _ => return,
                            };

                        let mut client_stream = hyper_util::rt::TokioIo::new(client_stream_raw);

                        let _ =
                            tokio::io::copy_bidirectional(&mut client_stream, &mut upstream_stream)
                                .await;
                    });

                    ApiResponse::new(Body::empty())
                        .with_status(status)
                        .with_headers(&headers)
                        .ok()
                },
            ),
        )
        .with_state(state.clone())
}
