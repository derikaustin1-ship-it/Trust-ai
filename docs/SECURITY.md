# Security & Reliability Policy

## Key Security Features

1. **Password Hashing**: Argon2 password hashing with bcrypt fallback.
2. **JWT Authentication**: Token-based access control with configurable expiry.
3. **Role-Based Access Control (RBAC)**: Enforces User, Reviewer, and Admin permissions on sensitive operations.
4. **Safe AST Math Evaluator**: Prevents arbitrary Python command execution during math verification using Python's `ast` module.
5. **No Key Exposure**: Provider API keys are never exposed in frontend bundles or client logs.
6. **SQL Injection Protection**: Parameterized ORM database queries via SQLAlchemy.
7. **Cross-Site Scripting (XSS) Safeguards**: HTML entity escaping on user content rendering.
