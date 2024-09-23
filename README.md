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
