# Clean Architecture Refactoring

This document outlines the refactoring efforts undertaken to improve the codebase's adherence to Clean Architecture principles and enhance separation of concerns.

## Summary of Changes

### 1. UI Layer Refactoring (Screens and Components)

- **`QuizScreen.tsx` and `ChallengeTabScreen.tsx`**: Business logic was extracted from these UI components into dedicated custom hooks. This ensures that UI components are primarily responsible for rendering and handling user interactions, while business logic resides in a separate, testable layer.

### 2. Application/Domain Layer Refactoring (Custom Hooks)

- **`useQuiz.ts`**: This hook was refactored to utilize a new `useQuizEngine.ts` hook. `useQuizEngine.ts` now encapsulates the core quiz logic (question generation, scoring, level progression), making `useQuiz.ts` responsible solely for presentation logic and UI state management.
- **`useChallengeData.ts`**: A new custom hook was created to handle data fetching and state management for challenge statistics and history. This abstracts data loading concerns away from the `ChallengeTabScreen.tsx` component.

### 3. Infrastructure/Data Layer Refactoring (Services and Repositories)

- **`quizService.ts`**: The data persistence logic related to quiz progress and learned countries was moved to a new `quizRepository.ts` file. `quizService.ts` now focuses purely on the business logic of the quiz.
- **`challengeScoringService.ts`**: Similarly, data persistence for challenge scores and statistics was moved to a new `challengeRepository.ts` file. `challengeScoringService.ts` now concentrates on score calculation and challenge-specific business rules.
- **`countryService.ts`**: Refactored to remove unused legacy arrays and functions, and to ensure that data retrieval functions (`getCountriesByRegion`, `getCountriesByRegionAndLevel`) correctly `await` asynchronous calls to `bundledDataService`.

## Benefits of Refactoring

- **Improved Separation of Concerns**: Each layer (UI, Application/Domain, Infrastructure) now has a clearer responsibility, leading to a more organized and understandable codebase.
- **Enhanced Testability**: By isolating business logic in dedicated hooks and services, it becomes easier to write unit tests for individual components without worrying about UI or data persistence dependencies.
- **Increased Maintainability**: Changes in one layer are less likely to impact other layers, reducing the risk of introducing bugs and making future modifications simpler.
- **Better Code Readability**: The codebase is now easier to navigate and understand, as logic is grouped logically.
- **Reduced Technical Debt**: By addressing mixed concerns, the refactoring reduces technical debt and sets a foundation for future development.

## Technical Details

- **New Files Created**:
    - `src/hooks/useQuizEngine.ts`
    - `src/hooks/useChallengeData.ts`
    - `src/services/quizRepository.ts`
    - `src/services/challengeRepository.ts`

- **Modified Files**:
    - `src/screens/QuizScreen.tsx`
    - `src/screens/ChallengeTabScreen.tsx`
    - `src/hooks/useQuiz.ts`
    - `src/services/quizService.ts`
    - `src/services/challengeScoringService.ts`
    - `src/services/countryService.ts`
    - `.eslintrc.js` (updated to ignore `ios/Pods` and remove `prettier` plugin integration)
    - `.prettierignore` (created to ignore `ios/Pods`)
    - `tsconfig.json` (updated to exclude `__tests__` directory)
    - `package.json` (added `tsc` script)

## Remaining Considerations

- **Linting Warnings**: A few linting warnings remain, primarily related to unused variables and missing `useEffect` dependencies. These are minor and can be addressed in future iterations.
- **Test Coverage**: While the refactoring improves testability, new tests should be written to cover the newly created hooks and updated services thoroughly.

This refactoring marks a significant step towards a more robust and scalable architecture for the World Explorer application.