# Architecture Decision Record (ADR) 1: Native SDK Implementation

## Status: Accepted

## Context

The Moneta mobile app is currently implemented using Flutter, a cross-platform framework. For the SDK, we need to decide whether to:

1. Create a native SDK using platform-specific languages (Swift for iOS, Kotlin for Android)
2. Create a Flutter plugin/package
3. Use another cross-platform approach (React Native, Xamarin, etc.)

This decision impacts development effort, performance, maintainability, and integration experience for third-party developers.

## Decision

We will implement the Moneta SDK as separate native libraries for iOS and Android platforms, using Swift and Kotlin respectively.

## Rationale

### Advantages of Native Implementation

1. **Performance**: Native code offers the best performance for critical financial operations.
2. **Platform Integration**: Direct access to platform-specific features like security hardware, biometrics, and UI components.
3. **Developer Experience**: Most iOS and Android developers prefer working with native SDKs that follow platform conventions.
4. **Security**: Better control over security implementations with direct access to KeyChain/KeyStore.
5. **Size Efficiency**: Native SDKs can be more lightweight than those requiring a runtime environment.
6. **Compliance**: Easier to meet platform-specific guidelines and security requirements.
7. **Long-term Stability**: Less dependency on third-party framework updates and compatibility issues.

### Challenges to Address

1. **Code Duplication**: Implementing the same features twice in different languages.
   - Mitigation: Shared architecture, specifications, and testing strategies.
2. **Feature Parity**: Ensuring both platforms maintain the same capabilities.
   - Mitigation: Unified product requirements and test suite.
3. **Development Resources**: Requires expertise in both platforms.
   - Mitigation: Clear interfaces and documentation to facilitate development.

### Comparison with Alternatives

| Approach | Performance | Platform Integration | Developer Experience | Maintenance |
|----------|-------------|---------------------|----------------------|-------------|
| Native (Swift/Kotlin) | Excellent | Excellent | Excellent | Moderate (2 codebases) |
| Flutter Plugin | Good | Limited | Good for Flutter devs, Poor for native devs | Simple (1 codebase) |
| React Native | Good | Limited | Mixed | Moderate |
| Xamarin | Good | Good | Limited audience | Moderate |

## Implementation Strategy

1. Define a common architecture and API surface for both platforms
2. Implement core functionality in parallel on both platforms
3. Establish common testing scenarios and acceptance criteria
4. Create unified documentation with platform-specific notes where needed

## Consequences

### Positive

- Optimal performance and security for financial transactions
- Better developer experience for third-party integration
- Direct access to platform capabilities and future OS features
- Enhanced control over implementation details

### Negative

- Higher development and maintenance effort
- Potential for feature divergence between platforms
- Steeper learning curve for internal developers moving between platforms

## Related Decisions

- API Design Principles (future ADR)
- Security Implementation Strategy (future ADR)
- Versioning and Compatibility Strategy (future ADR) 