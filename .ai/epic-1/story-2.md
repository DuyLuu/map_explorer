# Epic-1: SDK Foundation
# Story-2: Build System & CI/CD Pipeline

## Story
**As a** development team
**I want** a robust build system and a CI/CD pipeline configured
**so that** we can automate builds, tests, and deployments for both iOS and Android SDKs.

## Status: In Progress

## Context & Background
This story builds upon the basic placeholders created in Story-1. It involves configuring the native build systems (SwiftPM, Gradle) with necessary plugins, dependencies, and settings, and establishing a CI/CD workflow (e.g., using GitHub Actions) for automation.

## Story Points: 5

## Tasks
- [x] Configure iOS build settings (`Package.swift`) with necessary targets, dependencies (if any initially), and platform versions. (Kept placeholders for now)
- [x] Configure Android build settings (`build.gradle.kts`, `settings.gradle.kts`) with necessary plugins (Android Library, Kotlin), dependencies, SDK versions, and flavors (if needed).
- [x] Define CI/CD strategy (e.g., GitHub Actions, GitLab CI). (Chosen GitHub Actions)
- [x] Create initial CI/CD workflow file(s). (`.github/workflows/ci.yml`)
- [x] Implement basic build job in CI/CD for iOS.
- [x] Implement basic build job in CI/CD for Android.
- [x] Implement basic linting job in CI/CD for both platforms.
- [x] Implement basic unit test execution job in CI/CD for both platforms.

## Dev Notes
- Focus on establishing the core pipeline structure.
- Actual deployment steps (e.g., to artifact repositories) might be handled in later stories.
- Chosen CI/CD provider: GitHub Actions.

## Chat Log
- $(date +%Y-%m-%d): Story created.
- $(date +%Y-%m-%d): Kept placeholder `Package.swift` for iOS.
- $(date +%Y-%m-%d): Configured basic Android Gradle build files (`settings.gradle.kts`, `build.gradle.kts` for root and `:sdk`, `consumer-rules.pro`, `proguard-rules.pro`). Skipped `gradlew` generation.
- $(date +%Y-%m-%d): Decided to use GitHub Actions for CI/CD.
- $(date +%Y-%m-%d): Created basic workflow file `.github/workflows/ci.yml`.
- $(date +%Y-%m-%d): Added basic iOS build job (`build-ios`) to CI workflow.
- $(date +%Y-%m-%d): Added basic Android build job (`build-android`) to CI workflow.
- $(date +%Y-%m-%d): Added basic linting jobs (`lint-ios`, `lint-android`) to CI workflow.
- $(date +%Y-%m-%d): Added basic unit test jobs (`test-ios`, `test-android`) to CI workflow. 