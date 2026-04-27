# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- markdownlint-disable MD024 -->

## [Unreleased]

### Changed

- Reserved for upcoming API, schema, and deployment updates.

## [0.0.1] - 2026-04-26

### Added

- Added the initial io-service implementation with Hono routes for events and days.
- Added Drizzle ORM integration, migrations, and database tooling for the calendar schema.
- Added Docker support and a GitHub Actions workflow for building and publishing the service image.
- Added packaging support for distributing typed client artifacts to the business-logic service.

### Changed

- Simplified GitHub Actions version extraction for container publishing.
- Updated the Docker image setup to install `pnpm` directly for compatibility with the runtime base image.

### Fixed

- Fixed route typing so generated Hono client types are preserved when the service is consumed externally.
- Removed an unnecessary `vendor` copy step from the Docker build context so local and CI image builds succeed.
