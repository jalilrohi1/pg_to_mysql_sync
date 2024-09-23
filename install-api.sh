#!/bin/bash
# Function to ask for confirmation
confirm() {
  while true; do
    read -p "$1 (y/n): " yn
    case $yn in
      [Yy]* ) return 0;;  # Yes
      [Nn]* ) return 1;;  # No
      * ) echo "Please answer yes or no.";;
    esac
  done
}

# Function to update the .env file
update_env() {
  local var_name=$1
  local new_value=$2
  local env_file="$APP_DIR/.env"

  # Check if the variable exists in the .env file
  if grep -q "^$var_name=" "$env_file"; then
    # Update the variable
    sed -i "s/^$var_name=.*/$var_name=$new_value/" "$env_file"
  else
    # Append the variable if it doesn't exist
    echo "$var_name=$new_value" >> "$env_file"
  fi
}

# Check for root permissions
if [ "$(id -u)" != "0" ]; then
  echo "This script must be run as root" 1>&2
  exit 1
fi

# Ask for the username
read -p "Enter the username that will run the API: " USER

# Ask for the application name
read -p "Enter the name of your application (e.g., PG_TO_MYSQL_SYNC): " APP_NAME

# Ask for the application directory
read -p "Enter the path to your Express API directory: " APP_DIR

# Check if the directory exists
if [ ! -d "$APP_DIR" ]; then
  echo "The directory $APP_DIR does not exist. Exiting."
  exit 1
fi

# Ask to update .env variables (example for DB_HOST and DB_USER)
if confirm "Do you want to update .env file variables?"; then
  read -p "Enter the new value for MYSQL_DATABASE_URL. eg(mysql://root:Genova@localhost:3306/mysql_test_api): " MYSQL_DATABASE_URL
  read -p "Enter the new value for POSTGRES_DATABASE_URL. eg(postgres://postgres:Genova@localhost:5432/pg_test_api): " POSTGRES_DATABASE_URL
  read -p "Enter the URL OR IP for the API. eg:(https://localhost:3000): " SYNC_URL
  read -p "Enter the mode for the API. eg(# MODE=auto-check || manual || atuomatic): " MODE
  read -p "Enter the path for the HTTPS_KEY_PATH: " HTTPS_KEY_PATH
  read -p "Enter the path fot the HTTPS_Cert_PATH: "  HTTPS_CERT_PATH

  # Update .env file with the new values
  update_env "MYSQL_DATABASE_URL" "$MYSQL_DATABASE_URL"
  update_env "POSTGRES_DATABASE_URL" "$POSTGRES_DATABASE_URL"
  update_env "SYNC_URL" "$SYNC_URL"
  update_env "MODE" "$MODE"
  update_env "HTTPS_KEY_PATH" "$HTTPS_KEY_PATH"
  update_env "HTTPS_CERT_PATH" "$HTTPS_CERT_PATH"
  echo ".env file updated."
fi

# Step 1: Install dependencies

# Confirm Node.js installation
if confirm "Do you want to install Node.js and npm?"; then
  echo "Installing Node.js and npm..."
  apt-get update
  apt-get install -y nodejs npm
else
  echo "Skipping Node.js and npm installation."
fi

# Confirm PostgreSQL installation
if confirm "Do you want to install PostgreSQL?"; then
  echo "Installing PostgreSQL..."
  apt-get install -y postgresql
else
  echo "Skipping PostgreSQL installation."
fi

# Confirm MySQL installation
if confirm "Do you want to install MySQL?"; then
  echo "Installing MySQL..."
  apt-get install -y mysql-server
else
  echo "Skipping MySQL installation."
fi

# Step 2: Install npm packages
echo "Installing npm packages..."
cd $APP_DIR
npm install

# Step 3: Setup SysV init script
echo "Setting up SysV service..."
INIT_SCRIPT="/etc/init.d/$APP_NAME"

# Create init script
cat <<EOT > $INIT_SCRIPT
#!/bin/sh
### BEGIN INIT INFO
# Provides:          $APP_NAME
# Required-Start:    \$all
# Required-Stop:     \$all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start and stop Express API
# Description:       This file controls the API written in Node.js
### END INIT INFO

# User and App Variables
USER="$USER"
APP_DIR="$APP_DIR"
NODE_EXEC="/usr/bin/node"
LOG_FILE="/var/log/$APP_NAME.log"
PID_FILE="/var/run/$APP_NAME.pid"

start() {
  echo "Starting $APP_NAME..."
  cd \$APP_DIR
  su - \$USER -c "\$NODE_EXEC \$APP_DIR/index.js >> \$LOG_FILE 2>&1 & echo \$! > \$PID_FILE"
  echo "$APP_NAME started"
}

stop() {
  if [ -f \$PID_FILE ]; then
    PID=\$(cat \$PID_FILE)
    echo "Stopping $APP_NAME..."
    kill \$PID
    rm -f \$PID_FILE
    echo "$APP_NAME stopped"
  else
    echo "$APP_NAME is not running"
  fi
}

restart() {
  echo "Restarting $APP_NAME..."
  stop
  start
}

case "\$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  restart)
    restart
    ;;
  *)
    echo "Usage: \$0 {start|stop|restart}"
    exit 1
esac

exit 0
EOT

# Make the script executable
chmod +x $INIT_SCRIPT

# Add the service to system start-up
update-rc.d $APP_NAME defaults

# Step 4: Start the API service
echo "Starting the API service..."
service $APP_NAME start

echo "Installation complete. The API is running."
