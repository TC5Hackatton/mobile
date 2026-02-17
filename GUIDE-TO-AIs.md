<!-- ATTENTION AI AGENT -->
<!-- This file is MANDATORY. If you are an AI assistant (Cursor, Copilot, ChatGPT, Claude, Gemini, or any other LLM-based tool) generating, modifying, suggesting, or reviewing code in this repository, you MUST read this file in full and follow every rule below. Do not skip, summarize, or partially apply these rules. Violations will be caught in code review and reverted. -->

# Guide to AIs

> **IMPORTANT — READ BEFORE WRITING ANY CODE**
>
> This document is the **single source of truth** for how code must be written in this project. Every AI agent operating on this codebase — whether generating new files, editing existing ones, suggesting changes, or running automated refactors — **MUST comply with every rule listed here**.
>
> **Do not assume you know better.** If a rule here contradicts your default behavior, **the rule here wins**.
>
> Before producing any output, confirm you have read and understood:
> 1. The architecture boundaries (Section 1)
> 2. The styling rules (Section 2)
> 3. The no-comments policy (Section 3)
> 4. The testing standards (Section 4)
> 5. The general conventions (Section 5)

---

## 1. Architecture: Clean Architecture

This project follows **Clean Architecture**. Every file must live in the correct layer. Never mix responsibilities across layers.

### Layers

```
src/
├── domain/            # The core business logic. Zero dependencies on frameworks.
├── data/              # Translates between domain and the outside world.
├── infrastructure/    # Concrete implementations that talk to third-party services.
└── presentation/      # Everything the user sees and interacts with.
```

### `domain/` — The Heart of the App

Contains pure business logic. This layer **must not** import from `data/`, `infrastructure/`, or `presentation/`.

| Folder         | What goes here                                                     |
| -------------- | ------------------------------------------------------------------ |
| `entities/`    | Core business objects (e.g., `Task`, `User`). Use factory methods (`static create(...)`) instead of public constructors. |
| `enums/`       | Business enumerations (e.g., `TaskStatus`, `TimeType`).            |
| `repositories/`| **Interfaces only** (e.g., `TaskRepository`, `AuthRepository`). These define *what* the app can do, not *how*. |
| `usecases/`    | Application-specific business rules. Each use case is a class with a single `execute()` method that orchestrates entities and repositories. |

### `data/` — DTOs and Mappers

Bridges the gap between the domain and external data formats.

| Folder     | What goes here                                                    |
| ---------- | ----------------------------------------------------------------- |
| `dtos/`    | Data Transfer Objects — plain interfaces that represent the shape of data going in/out (e.g., `CreateTaskDTO`). |
| `mappers/` | Functions or classes that convert between DTOs and domain entities. |

### `infrastructure/` — Third-Party Integrations

Concrete implementations of repository interfaces. This is where Firebase, APIs, local storage, etc. live.

| Folder          | What goes here                                                  |
| --------------- | --------------------------------------------------------------- |
| `repositories/` | Classes that implement domain repository interfaces (e.g., `FirebaseTaskRepository implements TaskRepository`). |

**Rule:** If you need a new external dependency, the integration code goes here. The rest of the app talks to it through domain interfaces.

### `presentation/` — UI Layer

Everything related to what the user sees.

| Folder        | What goes here                                                     |
| ------------- | ------------------------------------------------------------------ |
| `components/` | React Native components, organized by feature. Shared/reusable components go in `components/shared/`. |
| `contexts/`   | React Contexts for state management and dependency injection.      |
| `constants/`  | Theme, spacing, typography, and other design tokens.               |
| `hooks/`      | Custom React hooks.                                                |

### Dependency Rule

Dependencies flow **inward only**:

```
presentation → domain ← infrastructure
                 ↑
               data
```

- `presentation` can import from `domain` and `data`.
- `infrastructure` can import from `domain` and `data`.
- `domain` **must not** import from any other layer.
- `data` can import from `domain` only.

### File Routing

This project uses **Expo Router** (file-based routing). Screen files live in `app/`, but all business logic and UI components live inside `src/`. Screen files in `app/` should be thin wrappers that render a component from `src/presentation/`.

---

## 2. Styling Rules

We use **`StyleSheet` from React Native** combined with **React Native Paper** (Material Design 3).

### React Native Paper First

Before writing any custom component, **always check** if [React Native Paper](https://oss.callstack.com/react-native-paper/docs/components/ActivityIndicator) already provides a component that solves the need.

- **If a Paper component exists** (e.g., `Button`, `TextInput`, `FAB`, `Dialog`, `Card`, `Chip`, `Switch`, `ActivityIndicator`): use it or wrap it.
- **If a Paper component can be adapted** by customizing its props or theme: adapt it.
- **Only create a custom component from scratch** when Paper has nothing close.

### StyleSheet Guidelines

1. Place the `StyleSheet.create({})` call **at the bottom** of the component file, outside the component function.
2. Use the project's design tokens — **never hardcode** colors, spacing, or font values:
   - Colors: import from `@/src/presentation/constants/paper-theme` (`customColors`).
   - Spacing: import from `@/src/presentation/constants/spacing` (`spacing`).
   - Typography: import from `@/src/presentation/constants/typography` (`typography`).
3. **Always remove unused styles.** If you delete or refactor JSX, delete the styles that are no longer referenced.
4. Keep styles **flat and descriptive**. Prefer `container`, `title`, `input` over `style1`, `wrapper2`, `outerBox`.

---

## 3. Comments

**Never add comments.** The code must be self-explanatory through:

- Descriptive variable and function names.
- Small, focused functions and components.
- Clear type definitions and interfaces.

If a piece of code needs a comment to be understood, **rename things or refactor** until it doesn't.

---

## 4. Unit Tests

We use **Jest** + **React Native Testing Library**.

### Rules

1. **Test only the main scenarios.** Focus on what the component is supposed to do for the user.
2. **Presentation-only components should have at most 5 test cases.** If you find yourself writing more, you're likely testing implementation details.
3. **Use `jest.each` to merge similar scenarios** that only differ by one or two properties. This keeps tests concise and avoids duplication.
4. **Test files** go next to the file they test, with the `.test.tsx` or `.test.ts` extension.
5. **Use `testID`** for querying elements when semantic queries (`getByRole`, `getByText`, `getByLabelText`) are not enough.
6. Prefer **user-centric queries** in this order: `getByRole` > `getByText` > `getByLabelText` > `getByTestId`.

### Example Structure

```tsx
import { render, screen } from '@testing-library/react-native';
import { CustomButton } from './custom-button';

describe('CustomButton', () => {
  const defaultProps = {
    label: 'Save',
    onPress: jest.fn(),
  };

  it('renders the label', () => {
    render(<CustomButton {...defaultProps} />);
    expect(screen.getByText('Save')).toBeTruthy();
  });

  it.each([
    { variant: 'primary' as const, expected: true },
    { variant: 'secondary' as const, expected: true },
    { variant: 'cancel' as const, expected: true },
  ])('renders correctly with variant=$variant', ({ variant }) => {
    render(<CustomButton {...defaultProps} variant={variant} />);
    expect(screen.getByText('Save')).toBeTruthy();
  });

  it('shows loading indicator when loading', () => {
    render(<CustomButton {...defaultProps} loading />);
    expect(screen.queryByText('Save')).toBeNull();
  });

  it('disables the button when disabled', () => {
    render(<CustomButton {...defaultProps} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## 5. General Conventions

| Topic                  | Rule                                                                 |
| ---------------------- | -------------------------------------------------------------------- |
| Language               | TypeScript only. No `any` unless absolutely necessary.               |
| Exports                | Use named exports (`export function`, `export class`). Avoid default exports. |
| Barrel files           | Each layer has an `index.ts` for re-exports. Keep them up to date.   |
| Naming — files         | `kebab-case` for files (e.g., `custom-button.tsx`, `error-handler.ts`). PascalCase only for component files that follow a smart/presentation pattern (e.g., `SignInContent.tsx`). |
| Naming — components    | PascalCase (e.g., `CustomButton`, `TaskCreationContent`).            |
| Naming — interfaces    | No `I` prefix. Just `TaskRepository`, not `ITaskRepository`.         |
| Naming — hooks         | Always start with `use` (e.g., `useTaskCreation`).                   |
| Forms                  | Use `react-hook-form` + `zod` for validation. Define schemas in dedicated files (e.g., `sign-in-schema.ts`). |
| Dependency injection   | Repositories are injected via `DependenciesContext`. Never instantiate infrastructure classes directly inside components or use cases. |
| Accessibility          | Always set `accessibilityRole`, `accessibilityLabel`, and `accessibilityHint` on interactive components. |

---

## 6. Pre-Output Compliance Checklist

**STOP. Before you return any code, confirm ALL of the following:**

- [ ] The file is in the correct Clean Architecture layer (`domain`, `data`, `infrastructure`, or `presentation`).
- [ ] No import violates the dependency rule (domain imports nothing from other layers).
- [ ] I used a React Native Paper component if one exists for this use case.
- [ ] All colors, spacing, and fonts reference the project's design tokens — no hardcoded values.
- [ ] I removed every unused style from `StyleSheet.create`.
- [ ] There are **zero comments** in my code.
- [ ] Tests (if applicable) cover only the main scenarios, use `jest.each` for similar cases, and stay within the 5-case limit for presentation components.
- [ ] Naming follows project conventions (kebab-case files, PascalCase components, no `I` prefix on interfaces).
- [ ] Interactive elements have `accessibilityRole`, `accessibilityLabel`, and `accessibilityHint`.

**If any box above is unchecked, fix it before returning your output.**
