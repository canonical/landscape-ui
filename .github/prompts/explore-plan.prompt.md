---
name: explore-plan
description: Plans a new feature and generates a <feature-name>.md plan in the project root.
arguments:
  - name: featureName
    description: The name of the feature (e.g., "scripts", "access-groups")
  - name: description
    description: Brief description of what the feature should do.
---

# Role

Invoke the **@Architect** persona.

# Process

1. **Clarification (Pre-flight):** If the user's description is vague or missing API endpoints, you **MUST** ask for them before generating the plan.
2. **Analysis:** Analyze the repo structure and `copilot-instructions.md`.
3. **Drafting:** Generate the markdown plan.

# Strict Constraints

- **NO IMPLEMENTATION:** Do not generate component logic, hook bodies, or CSS.
- **TYPE DEFINITIONS ONLY:** You may define TypeScript interfaces for API responses, but no executable code.
- **FILE PATHS:** All file paths must be absolute relative to root (e.g., `src/features/...`).

# Task

Generate a comprehensive implementation plan for the feature: `{{featureName}}`.

# Output Format

Create a file named `feature-plans/{{featureName}}.md`. If the `feature-plans/` directory doesn't exist, instruct the user to create it. Use the following structure:

## 1. Feature Overview

- **Objective:** {{description}}
- **Location:** `src/features/{{featureName}}/`

## 2. API Design

- **Endpoints:** [List endpoints provided by user or inferred]
- **Hooks to Create:**
  - `useGet{{featureName}}`: (List params and transformed return object)
  - `useCreate{{featureName}}`: (List mutation details)

## 3. Component Hierarchy

- `{{featureName}}Page.tsx`: Main entry point.
- `components/`: List specific sub-components (e.g., `{{featureName}}Table.tsx`, `New{{featureName}}Form.tsx`).

## 4. State & Logic

- **Forms:** Define `INITIAL_VALUES` and `VALIDATION_SCHEMA` (Yup).
- **Global Context:** Does this need a new context in `src/context/`? (Default to No).

## 5. Testing Plan

- **Unit Tests:** List key logic to test in `*.test.tsx`.
- **MSW Handlers:** Define the mock responses needed in `src/tests/mocks/`.

# Rules

- Reference `copilot-instructions.md` for naming conventions and imports.
- Ensure all imports use the `@/` alias.
- Use `Formik` + `Vanilla Framework` for all UI logic.
