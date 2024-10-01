# pg_to_mysql_sync API Documentation
## Overview
The pg_to_mysql_sync API is designed to synchronize data between a PostgreSQL and MySQL database. It operates based on specific triggers in PostgreSQL that notify the API of any data changes (insert, update, delete). Depending on the application mode, the API processes the data accordingly.

## Installation
**copy the API or clone to the location where you want to install**

***and then just run the follwoing command from inside of the API Directory***

<code> sudo ./install-api.sh </code>
### Managing the API Service
**Now we can start, stop, or restart our API service as root (or via sudo) using the following commands:**

<code>
service name-of-api start
service name-of-api stop
service name-of-api restart
service name-of-api status
</code>

## The API will work in three modes
#### MODE=manual || automatic || auto-check

we can set or change the mode from .env file

**Note we can run the API in Manual Mode from anywhere using the end point <code>.../sync/trigger-synctomysql</code> but we should provide the API Key And JWT**

## Key Features
- **Real-time synchronization:** Synchronizes changes made to a PostgreSQL database with a MySQL database.
- **Configurable modes:** Supports automatic, auto-check, and manual modes for data synchronization.
- **Text file backup:** Stores data temporarily in text files for later synchronization if necessary.
- **Secure:** Implements security best practices using libraries like helmet and jsonwebtoken.

## Technologies used:
- **Node.js:** The core of the API backend.
- **Express:** A fast web framework for Node.js used to create the API endpoints.
- **PostgreSQL (pg):** Used to handle communication with the PostgreSQL database.
- **MySQL (mysql2, mariadb):** Used to handle communication with the MySQL database.
- **pg-listen:** Listens to PostgreSQL notifications for real-time changes.
- **Sequelize:** An ORM used to interact with both PostgreSQL and MySQL databases.
- **Axios:** A promise-based HTTP client used for making external requests.
- **dotenv:** Loads environment variables from a .env file.
- **Helmet:** Adds security-related headers to protect the API.
- **jsonwebtoken:** Used for securing routes via token-based authentication.
- **API Key:** used for the authorization

## How the API Works (Flow of Operations)

### 1. Triggering the API
When a user inserts, updates, or deletes data in the PostgreSQL database, a trigger is activated on the table.
The trigger calls a notify data change function, which sends the following information to the API:
- **Operation** (insert, delete, update)
- **Data** (the actual data that was changed)
- **Table Name** (the table where the action occurred)

### 2. API Listener
The API listens on a designated port for PostgreSQL notifications.
Upon receiving data, the API saves it into a text file for backup purposes.
The API processes the data based on the mode set in the configuration.

### 3. Modes of Operation
- **Automatic Mode**: In this mode, the API immediately processes the data by calling the relevant route and performing operations on the received data.

- **Auto-Check Mode**: The API regularly checks for database connectivity at an interval defined by the user. If the connection is successful, it inserts all data stored in text files into the MySQL database and then deletes the files.

- **Manual Mode**: The API saves the received data into text files without performing any further operations. When the `/trigger-synctomysql` route is called manually, it processes and inserts the data into MySQL.

 ## Dependencies

### Production Dependencies:
- **axios**: ^1.7.2
- **dotenv**: ^10.0.0
- **express**: ^4.21.3
- **helmet**: ^7.1.0
- **jsonwebtoken**: ^9.0.2
- **mariadb**: ^3.3.1
- **mysql2**: ^3.11.0
- **pg**: ^8.6.0
- **pg-listen**: ^1.7.0
- **sequelize**: ^6.6.2

### Development Dependencies:
- **nodemon**: ^3.1.4

## Project Structure
<code>
pg_to_mysql_sync/
│
├── .env                         # Environment variables for database URIs, ports, etc.
├── .gitignore                   # Ignored files and directories for Git
├── certificate/                 # SSL/TLS certificates for HTTPS
│   ├── selfsigned.crt           # Self-signed certificate
│   └── selfsigned.key           # Private key for the self-signed certificate
│
├── config/                      # Configuration files
│   ├── database.js              # Database connection configurations for PostgreSQL and MySQL
│   └── https.js                 # HTTPS configuration setup
│
├── DataBaseScripts/              # SQL scripts for setting up database functions and triggers
│   ├── notifyDataChangeFunction.sql  # SQL script for Postgres notify function
│   └── trigger.sql              # SQL script to create database triggers
│
├── pgsync_custome_package/       # Custom PostgreSQL sync package scripts
│   └── trigger.sql              # Custom trigger logic for syncing
│
├── datalog/                     # Directory for logging data changes and API sync logs
│
├── install-api.sh               # Shell script for installing and configuring the API
│
├── listener.js                  # Listens to PostgreSQL notifications and triggers the sync process
│
├── middleware/                  # Middleware functions for API requests
│   ├── apiKey.js                # Validates API key from request headers
│   ├── auth.js                  # Token-based authentication middleware
│   ├── deletetextfiles.js       # Deletes text files after successful sync
│   ├── logToFile.js             # Middleware to log data changes to a file
│   ├── readLogFiles.js          # Reads log files for processing
│   ├── syncfailedlog.js         # Logs failed synchronization attempts
│   ├── synctomyysql.js          # Handles syncing data from PostgreSQL to MySQL
│   ├── testmysqlconnection.js   # Tests the connection to the MySQL database
│   └── utils.js                 # Utility functions for general purpose tasks
│
├── models/                      # Database models
│   ├── ApiKey.js                # Model for managing API keys
│   ├── index.js                 # Centralized exports for all models
│   └── MysqlModel.js            # Model and schema for MySQL operations
│
├── package.json                 # Project metadata and dependencies
├── pgsync_custome_package.md    # Documentation for custom Postgres sync package
├── README.md                    # Main project documentation
│
├── routes/                      # API routes (empty in this structure for brevity)
│
├── server.js                    # Entry point for the API server
│
├── testing_code/                # Directory for any test scripts or code samples
</code>
