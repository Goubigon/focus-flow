#!/bin/bash

# Get environment variables
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_HOST=$DB_HOST
DB_NAME_MATH=$DB_NAME_MATH
echo "Variable set"

# Execute the MySQL command to check if the database exists
if mysql -u"$DB_USER" -p"$DB_PASSWORD" -h"$DB_HOST" -D"$DB_NAME_MATH" -e "SELECT 1;" &>/dev/null; then
    echo "MySQL connection successful"
else
    echo "MySQL connection failed"
    exit 1
fi

# Generate random tokens using OpenSSL
echo "Generating SSL Token"
ACCESS_TOKEN_SECRET=$(openssl rand -hex 64)
REFRESH_TOKEN_SECRET=$(openssl rand -hex 64)


# .env file used by the node app
echo "Creating .env file"
{
    echo "DB_HOST=db"
    echo "DB_USER=${DB_USER}"
    echo "DB_PASSWORD=${DB_PASSWORD}"
    echo "DB_NAME_MATH=${DB_NAME_MATH}"
    echo "ACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET}"
    echo "REFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET}"
} > .env

# certificates used by node app
echo "Creating https certificates"
openssl req \
-x509 \
-out certificates/localhost.pem \
-keyout certificates/localhost-key.pem \
-newkey rsa:2048 \
-nodes \
-sha256 \
-subj "/CN=localhost" \
-extensions EXT \
-config <(printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

# Starting node app
node app.js