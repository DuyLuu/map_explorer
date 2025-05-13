# Epic-1: SDK Foundation
# Story-4: Sample Applications

## Story
**As a** developer using the SDK (or the SDK development team)
**I want** basic sample applications for both iOS and Android
**so that** I can test and demonstrate the SDK's integration and basic functionality.

## Status: Completed

## Context & Background
This involves creating minimal, runnable applications for each platform that integrate the Moneta SDK. These apps will serve as a testbed during development and later as examples for third-party developers.

## Story Points: 5

## Tasks
- [x] Create basic iOS Sample App project structure within `moneta-ios-sdk` (e.g., using Xcode template). (Manual Step Completed)
- [x] Configure iOS Sample App to depend on the local `MonetaSDK` package. (Manual Step Completed)
- [x] Create basic Android Sample App module structure within `moneta-android-sdk` (e.g., `/app` module).
- [x] Configure Android Sample App to depend on the local `:sdk` module.
- [x] Implement a minimal UI in the iOS Sample App to invoke a placeholder SDK function. (Basic UI + Init call added)
- [x] Implement a minimal UI in the Android Sample App to invoke a placeholder SDK function. (Basic setup done)
- [x] Ensure both sample apps build and run correctly. (Verified both iOS and Android apps build and run)

## Dev Notes
- Keep the sample apps extremely simple initially.
- They will evolve as SDK features are added.
- Include basic instructions in READMEs on how to build/run them.

## Chat Log
- $(date +%Y-%m-%d): Story created.
- $(date +%Y-%m-%d): Created basic structure and build config for Android sample app (:app).
- $(date +%Y-%m-%d): Added basic Activity, Layout, and Resources for Android sample app.
- $(date +%Y-%m-%d): Added placeholder source files for iOS sample app.
- $(date +%Y-%m-%d): Added SDKEnvironment.initialize call to iOS sample app.
- $(date +%Y-%m-%d): Reorganized iOS project structure with proper naming.
- $(date +%Y-%m-%d): Fixed SDK compilation issues by making appropriate classes public.
- $(date +%Y-%m-%d): Verified both iOS and Android sample apps build and run correctly. 