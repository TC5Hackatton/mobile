---
description: Best practices for writing Jest unit tests in TypeScript/JavaScript projects
---

# Jest Unit Testing Best Practices

This skill document captures best practices and common patterns for writing effective Jest unit tests, particularly for Clean Architecture projects.

## Test File Organization

### Naming Convention
- Use `.spec.ts` (or `.spec.js`) for test files
- Co-locate tests with source files: `MyClass.ts` → `MyClass.spec.ts`

### Test Structure

**Flatten unnecessary nesting:**
```typescript
// ❌ DON'T: Unnecessary nested describe when there's only one method
describe('MyUseCase', () => {
  beforeEach(() => { /* setup */ });

  describe('execute', () => {  // ← Unnecessary nesting
    it('should do something', () => {});
  });
});

// ✅ DO: Keep it flat when testing a single method
describe('MyUseCase', () => {
  beforeEach(() => { /* setup */ });

  it('should do something', () => {});
  it('should handle errors', () => {});
});
```

**Use nested describe blocks only when:**
- Testing multiple public methods
- Grouping related test scenarios logically
- Testing different configurations or states

## Error Handling in Tests

### Synchronous vs Asynchronous Errors

**Critical distinction:** Methods that throw errors synchronously vs those that return rejected promises require different test assertions.

```typescript
// Synchronous error (thrown before returning a promise)
execute(email: string) {
  if (!email) {
    throw new Error('Email required');  // ← Synchronous throw
  }
  return this.repository.doSomething(email);
}

// Test with synchronous assertion
it('should throw error for missing email', () => {
  expect(() => useCase.execute('')).toThrow('Email required');
});
```

```typescript
// Asynchronous error (rejected promise)
async execute(email: string) {
  const user = await this.repository.getUser(email);
  if (!user) {
    throw new Error('User not found');  // ← Async throw
  }
  return user;
}

// Test with async assertion
it('should throw error when user not found', async () => {
  await expect(useCase.execute('test@example.com')).rejects.toThrow('User not found');
});
```

### Common Mistake
```typescript
// ❌ WRONG: Using rejects.toThrow() for synchronous errors
it('should validate email', async () => {
  await expect(useCase.execute('')).rejects.toThrow('Email required');
  // This will FAIL because the error is thrown synchronously
});

// ✅ CORRECT: Use synchronous assertion
it('should validate email', () => {
  expect(() => useCase.execute('')).toThrow('Email required');
});
```

## Mocking Best Practices

### Repository Mocking Pattern

```typescript
describe('MyUseCase', () => {
  let useCase: MyUseCase;
  let mockRepository: jest.Mocked<MyRepository>;

  beforeEach(() => {
    // Create fully typed mock
    mockRepository = {
      method1: jest.fn(),
      method2: jest.fn(),
      method3: jest.fn(),
    };

    useCase = new MyUseCase(mockRepository);
  });

  it('should call repository correctly', async () => {
    const mockData = { id: '123', name: 'Test' };
    mockRepository.method1.mockResolvedValue(mockData);

    const result = await useCase.execute();

    expect(mockRepository.method1).toHaveBeenCalledTimes(1);
    expect(mockRepository.method1).toHaveBeenCalledWith(/* expected args */);
    expect(result).toBe(mockData);
  });
});
```

### Shared Test Data

For data used across multiple tests, define it at the describe block level:

```typescript
describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let mockRepository: jest.Mocked<TaskRepository>;

  // Shared test data
  const mockTaskDTO = {
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TODO,
  };

  beforeEach(() => {
    // Setup mocks
  });

  it('should create task', async () => {
    // Use mockTaskDTO in tests
  });
});
```

## Test Coverage

### Comprehensive Edge Cases

Always test:
1. **Happy path**: Normal, expected behavior
2. **Null/undefined**: Missing required data
3. **Empty strings**: Validation edge cases
4. **Error propagation**: Errors from dependencies
5. **Boundary conditions**: Min/max values, edge cases

```typescript
describe('SignInUseCase', () => {
  // Happy path
  it('should sign in with valid credentials', async () => {});

  // Null/undefined
  it('should throw error when email is null', () => {});
  it('should throw error when email is undefined', () => {});

  // Empty strings
  it('should throw error when email is empty string', () => {});

  // Error propagation
  it('should propagate errors from repository', async () => {});
});
```

### Validation Testing

For validation logic (email, phone, etc.), test multiple invalid formats:

```typescript
it('should throw error with invalid email - missing @', () => {});
it('should throw error with invalid email - missing domain', () => {});
it('should throw error with invalid email - no extension', () => {});
it('should throw error with invalid email - spaces', () => {});
```

## Running Tests

### Command Patterns

```bash
# Single run (CI/CD, verification)
npm test -- --watchAll=false

# With coverage
npm test -- --coverage --watchAll=false

# Specific coverage paths
npm test -- --coverage --watchAll=false \
  --collectCoverageFrom='src/domain/**/*.ts' \
  --collectCoverageFrom='!src/domain/**/*.spec.ts'

# Verbose output
npm test -- --watchAll=false --verbose
```

**Note:** Avoid `--watchAll` flag for one-shot test runs. It's only needed for development watch mode.

## Clean Architecture Testing

### Domain Layer (Pure TypeScript)
- **Entities**: Test factory methods and property assignments
- **Use Cases**: Test business logic, validation, error handling
- **No mocking needed**: Entities and value objects
- **Mock dependencies**: Repositories, external services

### Testing Use Cases

```typescript
describe('CreateTaskUseCase', () => {
  // 1. Mock all dependencies (repositories)
  let mockAuthRepo: jest.Mocked<AuthRepository>;
  let mockTaskRepo: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    // 2. Setup fresh mocks for each test
    mockAuthRepo = { /* all methods */ };
    mockTaskRepo = { /* all methods */ };
  });

  // 3. Test business logic
  it('should validate user before creating task', async () => {
    // Arrange: Setup mock responses
    mockAuthRepo.getCurrentUser.mockResolvedValue(mockUser);

    // Act: Execute use case
    await useCase.execute(taskDTO);

    // Assert: Verify behavior
    expect(mockAuthRepo.getCurrentUser).toHaveBeenCalled();
    expect(mockTaskRepo.createTask).toHaveBeenCalledWith(taskDTO, mockUser.uid);
  });

  // 4. Test error scenarios
  it('should throw error when user is missing', async () => {
    mockAuthRepo.getCurrentUser.mockResolvedValue(null);

    await expect(useCase.execute(taskDTO)).rejects.toThrow('User is missing');
    expect(mockTaskRepo.createTask).not.toHaveBeenCalled();
  });
});
```

## Common Patterns

### Testing Entity Factory Methods

```typescript
describe('Task Entity', () => {
  it('should create task with all properties', () => {
    const task = Task.create('Title', 'Description', TimeType.FIXED, 60, 0, TaskStatus.TODO);

    expect(task.title).toBe('Title');
    expect(task.description).toBe('Description');
    expect(task.timeType).toBe(TimeType.FIXED);
  });

  it('should create task with optional parameters', () => {
    const task = Task.create(/* ... */, 'task-id', 'user-id');

    expect(task.id).toBe('task-id');
    expect(task.uid).toBe('user-id');
  });
});
```

### Testing Validation Logic

```typescript
describe('Email Validation', () => {
  it('should accept valid emails', async () => {
    await useCase.execute('valid@example.com', 'password');
    expect(mockRepo.signUp).toHaveBeenCalled();
  });

  it('should reject invalid emails', () => {
    expect(() => useCase.execute('invalid', 'password')).toThrow('Invalid email');
    expect(mockRepo.signUp).not.toHaveBeenCalled();
  });
});
```

## Key Takeaways

1. **Flatten test structure** when there's only one method being tested
2. **Distinguish sync vs async** error handling in assertions
3. **Mock all dependencies** for unit tests (repositories, services)
4. **Test edge cases comprehensively** (null, undefined, empty, errors)
5. **Use `.spec.ts` naming** convention
6. **Co-locate tests** with source files
7. **Run without --watchAll** for one-shot execution
8. **Aim for 80%+ coverage** with meaningful tests, not just numbers

## DTO Property Naming

When mocking DTOs, ensure property names match the actual DTO interface:

```typescript
// ❌ WRONG: Using snake_case when DTO uses camelCase
const mockDTO = {
  time_type: TimeType.FIXED,  // Wrong!
  time_value: 60,
};

// ✅ CORRECT: Match the actual DTO interface
const mockDTO: CreateTaskDTO = {
  timeType: TimeType.FIXED,  // Correct!
  timeSpend: 0,
};
```

Always check the actual DTO definition to ensure property names match exactly.
