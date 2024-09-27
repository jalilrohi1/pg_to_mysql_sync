# pg_to_mysql_sync
A RESTful API which synchronize the PostgreSQL to MySQL 

## installaion
**copy the API or clone to the location where you want to install**

***and then just run the follwoing command from inside of the API Directory***

<code> sudo ./install-api.sh </code>
### Managing the API Service
**Now we can start, stop, or restart our API service using the following commands:**

<code>sudo service name-of-api start
sudo service name-of-api stop
sudo service name-of-api restart
sudo service name-of-api status
</code>

## The API will work in three modes
#### MODE=manual || atuomatic || auto-check

we can set or change the mode from .env file

**Note we can run the API in Manual Mode from anywhere using the end point <code>.../sync/trigger-synctomysql</code>**

# How the API Works (flow of API)
  1. When the user Insert,Update, or Delete the data from Postgres DB then if we set our trigger on the teble on which user performed the action then the trigger will call the notify data change function and the function will notify the API, with *Operation(insert,delete,update), Data, and Table Name*
  2. The API is listing to the *port* which we assign when Postgres notify the API the API will recieved the data and save it to a text file after it will process the data as per the mode of application we set to the API.
  3. if the Mode is automatic the API will call the rout and perform the operation on the data.
  4. if the mode is auto-check then the API will check the connection on interval time which we give it, and when ever it succeeded to connect then it will insert all the data which is save in the text files and it will delete the files.
  5. if the mode is manual the it will just save the data into a text file and when ever we call the */trigger-synctomysql* manueually.

# API Explanation
## Key Features
- **Real-time synchronization:** Synchronizes changes made to a PostgreSQL database with a MySQL database.
- **Configurable modes:** Supports automatic, auto-check, and manual modes for data synchronization.
- **Text file backup:** Stores data temporarily in text files for later synchronization if necessary.
- **Secure:** Implements security best practices using libraries like helmet and jsonwebtoken.

## Technologise used:
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
  
