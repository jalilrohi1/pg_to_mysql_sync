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

### 1. Coding Standards
- JavaScript/Node.js Version: Ensure that your code is compatible with the project's supported Node.js version. We currently support Node.js 14.x and above.
- Code Style: Follow the Airbnb JavaScript Style Guide. Use tools like ESLint to ensure your code is consistent with this style guide. Some specific rules include:
  - Use **2 spaces for indentation** (no tabs).
  - Prefer **arrow functions** where appropriate.
  - Always use `const` or `let` (no `var`).
  - **Use single quotes** for strings (`'`) unless you are using string interpolation with backticks (``).
- **Module Imports:** Use **ES6+ syntax** for imports and exports:
```
import express from 'express';
import { syncPostgresToMySQL } from './services/syncService';
```
- No Direct Database Access: Avoid writing SQL queries directly inside route handlers. Use data access services (like syncService) to encapsulate all database interactions.
- Ensure code is well-documented.
- Write meaningful commit messages.

### 2. Folder Structure
The project follows a modular structure to keep things organized. Please ensure new files or services are added in the appropriate directories:

- `/routes`: Define route handlers here.
- `/middleware`: Place logic for database synchronization, querying, and business logic here.
- `/models`: Use Sequelize or TypeORM to define models for both PostgreSQL and MySQL databases here.
- `/config`: Store configuration files like database credentials and environment settings (make sure sensitive data is excluded from version control via .gitignore).
- `/tests`: All tests, including unit and integration tests, should go here.
- `/docs`: Add or update API documentation here (e.g., using Swagger or Postman collections).
### 3. Database Operations
- Use ORM libraries like Sequelize (preferred) or TypeORM for interacting with both PostgreSQL and MySQL.
- Transactional Safety: Always use transactions when performing multiple database operations that need to be atomic. Both PostgreSQL and MySQL support transactions, and they should be used to ensure data consistency during synchronization.
- Error Handling: Use proper error handling around database operations, ensuring that any failure in synchronization triggers proper rollback mechanisms for both databases.
```
try {
  await sequelize.transaction(async (t) => {
    const result1 = await Model1.create(data, { transaction: t });
    const result2 = await Model2.create(data, { transaction: t });
    return result1;
  });
} catch (error) {
  console.error('Transaction failed:', error);
  throw new Error('Database synchronization failed');
}
```
### 4. Sync Logic
- **Data Integrity:** When synchronizing data between PostgreSQL and MySQL, ensure that data validation and transformation steps are clearly defined and handled inside the syncService.
- **Database Migrations:** Use migration tools (like Sequelize's migration system) to handle database schema changes consistently across both databases. Include migration scripts for both PostgreSQL and MySQL.
- **Conflict Resolution:** If synchronization conflicts arise (e.g., data discrepancies between PostgreSQL and MySQL), handle them within the service layer and log any unresolved issues for future review.
### 5. API Routes
- **RESTful Principles:** Ensure API routes follow RESTful conventions:
  - ` GET /sync`: Triggers a synchronization task between PostgreSQL and MySQL.
  - ` GET /status`: Returns the current synchronization status.
- **HTTP Status Codes:** Return appropriate HTTP status codes for each response. For example:
  - **200 OK** for successful sync operations.
  - **400 Bad Request** for invalid inputs.
  - **500 Internal Server Error** for synchronization errors.
### 6. Testing
- **Unit Tests:** Write unit tests for all new services or utility functions. Mock database interactions using tools like Sinon or Jest mocks.
- **Integration Tests:** Ensure integration tests cover synchronization between PostgreSQL and MySQL, testing the full process.
- **Test Coverage:** We aim for a minimum of 90% test coverage for both unit and integration tests. Use Jest or Mocha for testing.
- **CI Pipeline:** Ensure that all tests pass in the CI pipeline (GitHub Actions). Any contribution that breaks the CI pipeline will not be merged
  
Example of unit testing a sync service:
```
import { syncPostgresToMySQL } from '../services/syncService';
import { expect } from 'chai';

describe('syncPostgresToMySQL', () => {
  it('should sync data successfully', async () => {
    const result = await syncPostgresToMySQL();
    expect(result).to.be.an('object');
    expect(result.success).to.be.true;
  });
});
```
## Submitting Issues
If you find a bug or have a feature request, please use one of the following templates:
- **Bug Report**: [Bug Report Template](https://github.com/your-repo/your-project/.github/ISSUE_TEMPLATE/bug_report.md)
- **Feature Request**: [Feature Request Template](https://github.com/your-repo/your-project/.github/ISSUE_TEMPLATE/feature_request.md)

## Code Reviews
All pull requests will be reviewed. Please be patient as we work through them. Be prepared for constructive feedback. Multiple reviews might be necessary.

## Vision and Roadmap

The API aims to provide a seamless and efficient way to synchronize data between PostgreSQL and MySQL databases. This project is designed for developers needing to integrate, migrate, or replicate data between these databases with ease, while ensuring transactional integrity and high performance. Our goal is to create an API that is scalable, robust, and easy to integrate into any system, allowing businesses to manage cross-database interactions with minimal effort. 

We are committed to maintaining code quality, security, and open collaboration to evolve this project and meet the growing needs of developers across industries.


For more details on where the project is headed, check out our For more details on where the project is headed, check out our [public roadmap](https://github.com/your-repo/your-project/ROADMAP.md).

Thank you for contributing!
