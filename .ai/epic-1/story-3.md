# Epic-1: SDK Foundation
# Story-3: Core SDK Infrastructure

## Story
**As a** developer
**I want** the fundamental core components and utilities of the SDK established
**so that** functional modules can be built upon a stable foundation.

## Status: Complete

## Context & Background
This story involves creating the essential non-functional building blocks shared across the SDK, such as networking foundations, data handling utilities, logging, error handling, and base models or protocols for both iOS and Android platforms.

## Story Points: 8

## Tasks
- [x] Define core directory structure within `moneta-ios-sdk/Sources/MonetaSDK` and `moneta-android-sdk/sdk/src/main/kotlin/com/moneta/sdk`.
- [x] Implement basic Logging utility (iOS & Android).
- [x] Define common Error types/protocols (iOS & Android).
- [x] Implement basic Network client setup (wrapper around native APIs, initial configuration) (iOS & Android).
- [x] Define core Data Models/Protocols (e.g., base request/response structures) (iOS & Android).
- [x] Implement basic secure storage wrapper (e.g., Keychain/Keystore access) (iOS & Android).
- [x] Setup initial dependency injection or service locator pattern (iOS & Android).
- [x] Add unit tests for core utilities. (Basic tests for Error types added)

## Dev Notes
- Focus on foundational, reusable components.
- Ensure consistency in approach between iOS and Android where feasible.
- Defer complex implementations (e.g., full offline support) to later epics.

## Chat Log
- $(date +%Y-%m-%d): Story created.
- $(date +%Y-%m-%d): Created core directory structure within iOS and Android source sets.
- $(date +%Y-%m-%d): Implemented basic internal Logger utility for iOS (os.log) and Android (Log).
- $(date +%Y-%m-%d): Defined base MonetaError protocol (iOS) and MonetaException class (Android) with Network examples.
- $(date +%Y-%m-%d): Implemented basic HTTPClient (URLSession/async) for iOS and HttpClientProvider (OkHttp) for Android.
- $(date +%Y-%m-%d): Defined generic ApiResponse structure for iOS and Android network models.
- $(date +%Y-%m-%d): Implemented basic SecureStorage wrapper for Android (EncryptedPrefs) and iOS (Keychain).
- $(date +%Y-%m-%d): Implemented internal SDKEnvironment registry/locator for dependency management.
- $(date +%Y-%m-%d): Added basic unit tests for Error types (iOS & Android). 