# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2024-12-19 14:30 CST] - Square API Pagination Fix
- Fixed Square inventory API to fetch ALL items using proper pagination
- Implemented fetchAllSquareItems() function with cursor-based pagination
- Updated Square API calls to handle collections over 100 items
- Fixed inventory display to show complete catalog instead of just 8 items
- Updated debug endpoint to test full pagination
- Frontend already configured for 24 items per page (multiple of 3)
Memory: 45% of max

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [1.0.0] - YYYY-MM-DD

### Added
- Initial release
