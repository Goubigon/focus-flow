#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Creation of the database and tables
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME_MATH" < /db_installation/math_db_schema.sql

# Load sample data for guest access:
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME_MATH" < /db_installation/math_user_credential_seed.sql
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME_MATH" < /db_installation/math_user_stat_seed.sql
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME_MATH" < /db_installation/math_session_parameters_seed.sql
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME_MATH" < /db_installation/math_session_seed.sql
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME_MATH" < /db_installation/math_answer_seed.sql