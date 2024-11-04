#!/bin/bash

# Define database credentials and the database name to check
DB_USER=$DB_USER
DB_PASS=$DB_PASS
DB_HOST=$DB_HOST

DB_NAME="math_db"

# Execute the MySQL command to check if the database exists
DB_EXISTS=$(mysql -u$DB_USER -p$DB_PASS -h$DB_HOST -e "SHOW DATABASES LIKE '$DB_NAME';" | grep "$DB_NAME" > /dev/null; echo "$?")

# Check the output of the command
if [ "$DB_EXISTS" -eq 0 ]; then
    echo "Database '$DB_NAME' exists."
    # Check if there is actual data
else
    echo "Database '$DB_NAME' does not exist."
    exit(-1)
fi



node app.js
