![Calagopus Logo](https://calagopus.com/fulllogo.svg)

# Calagopus Panel

[![Rust](https://img.shields.io/badge/rust-stable-orange.svg?logo=rust)](https://www.rust-lang.org/)
[![License](https://img.shields.io/github/license/calagopus/panel?color=blue)](https://github.com/calagopus/panel/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/calagopus/panel)](https://github.com/calagopus/panel/issues)
[![GitHub stars](https://img.shields.io/github/stars/calagopus/panel)](https://github.com/calagopus/panel/stargazers)
[![Discord](https://img.shields.io/discord/1429911351777824892?label=discord&logo=discord&color=5865F2)](https://discord.gg/uSM8tvTxBV)

A "rewrite" of [Pterodactyl Panel](https://github.com/pterodactyl/panel) in the Rust Programming Language. This rewrite aims to be a better alternative to the original Panel, implementing new Features, better Performance and a new UI.

## Installation

For installation instructions, please refer to the [Docs](https://calagopus.com/docs/panel/installation).

## Todo

[Frontend](https://notes.rjns.dev/workspace/cb7ccae8-0508-4f90-9161-d1e69b0ca8f0/oXJcC5ei3IQhEf1RFCh6K) 
/ [Backend](https://notes.rjns.dev/workspace/cb7ccae8-0508-4f90-9161-d1e69b0ca8f0/xfvzMIFHkFSMnOfO_WUEO)

## Directory Structure

* [**`frontend/`**](./frontend/) — The frontend of the panel, built with React, Mantine, and Tailwind.
  * [**`extensions/*`**](./frontend/extensions/) — Extensions for the frontend, such as themes and plugins.
* [**`backend/`**](./backend/) — The backend of the panel, built with Rust and Axum.
* [**`backend-extensions/*`**](./backend-extensions/) — Extensions for the backend, such as auth providers and database drivers.
* [**`database/`**](./database/) — Database migrations using Drizzle.
* [**`database-migrator/`**](./database-migrator/) — A tool to run database migrations, built with Rust and SQLx.
* [**`shared/`**](./shared/) — Shared code between various backend parts, mainly relevant for extensions.
* [**`wings-api/`**](./wings-api/) — An auto-generated API client for the Wings API, built with Rust.
  * [**`generator-src/`**](./wings-api/generator-src/) — The source code for the API generator, written in TypeScript.
* [**`rule-validator/`**](./rule-validator/) — A semi-port of Laravel's validation rules in Rust for use with eggs.
* [**`schema-extension/`**](./schema-extension/)
  * [**`core/`**](./schema-extension/core/) — Core library for the schema extension system.
  * [**`derive/`**](./schema-extension/derive/) — A proc macro to derive schema extensions.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=calagopus/panel&type=date&legend=top-left)](https://www.star-history.com/#calagopus/panel&type=date&legend=top-left)
