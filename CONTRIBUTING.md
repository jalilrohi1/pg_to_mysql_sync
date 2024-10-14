# Contributing to pg_to_mysql_sync

We appreciate your interest in contributing to pg_to_mysql_sync! Here are the guidelines to help you get started.

## How to Contribute
1. Fork the repository and create a new branch for your changes.
2. Make sure your changes align with the project's goals and coding standards.
3. Add tests for your changes and ensure all existing tests pass.
4. Submit a pull request (PR) with a clear description of what you've done.
5. Wait for feedback from maintainers.

## Specific Guidelines for Your Code Base
Please follow these standards for all contributions:
To maintain high-quality contributions to the project, please adhere to the following specific guidelines when working with our Express.js API that synchronizes PostgreSQL with MySQL.

1. Coding Standards
- JavaScript/Node.js Version: Ensure that your code is compatible with the project's supported Node.js version. We currently support Node.js 14.x and above.
- Code Style: Follow the Airbnb JavaScript Style Guide. Use tools like ESLint to ensure your code is consistent with this style guide. Some specific rules include:
  - Use 2 spaces for indentation (no tabs).
  - Prefer arrow functions where appropriate.
  - Always use const or let (no var).
  - Use single quotes for strings (') unless you are using string interpolation with backticks (``).
- Module Imports: Use ES6+ syntax for imports and exports:
`import express from 'express';
import { syncPostgresToMySQL } from './services/syncService';
`
- Ensure code is well-documented.
- Write meaningful commit messages.

## Submitting Issues
If you find a bug or have a feature request, please use one of the following templates:
- **Bug Report**: [Link to bug report template]
- **Feature Request**: [Link to feature request template]

## Code Reviews
All pull requests will be reviewed. Please be patient as we work through them. Be prepared for constructive feedback. Multiple reviews might be necessary.

## Vision and Roadmap
[Brief summary of your vision for the API]

For more details on where the project is headed, check out our [public roadmap](link to roadmap).

Thank you for contributing!
