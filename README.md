# Table of Contents
1. [Introduction](#introduction)
2. [Demo](#demo)
3. [Features](#features)
4. [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Clone the Repository](#clone-the-repository)
    - [Install Node Dependencies](#install-node-dependencies)
    - [Environment Variables](#prepare-your-environment-variables)
        - [What is a .env File?](#what-is-a-dotenv-file)
        - [Creating your .env File](#creating-your-dotenv-file)
    - [Database Setup](#database-setup)
    - [Run the App](#run-the-app)
5. [Screenshots](#screenshots)
    - [Dashboard Page](#dashboard-page)
    - [End Results](#end-results)

# Introduction

Welcome to **Focus Flow**, an engaging math quiz application! 
This app provides users with a customizable set of math questions at various difficulty levels and offers an interactive dashboard to track performance. Use the guest mode to explore sample data or sign up to save your personalized stats.

## Demo
![App Demo](assets/exercise_demo.gif)



## Features
- **Flexible Math Challenges**: Choose from multiple difficulty levels or create a custom set of questions.
- **Dashboard Insights**: Track performance metrics, including time, date, and scores across levels.
- **User Authentication**: Securely log in using JSON Web Tokens (JWT) to save your progress.
- **Guest Access**: Try the app without registering via a "Guest" option to explore the features with sample data.

## Installation
### Prerequisites
Ensure you have the following installed:
```
Node.js (v20)
MySQL
git
openSSL
```

### Clone the Repository

```bash
git clone https://github.com/Goubigon/focus-flow.git
```

### Install node dependencies
Navigate into the project folder and install dependencies:
```bash
cd focus-flow
npm install
```

This app requires the following key packages:
```
├── bcrypt@5.1.1
├── cookie-parser@1.4.6
├── dotenv@16.4.5
├── express@4.21.0
├── jsonwebtoken@9.0.2
├── mysql2@3.11.0
```

### Prepare your environment variables

#### What is a dotenv file?
A .env file stores environment variables securely, including sensitive information like database credentials and API keys. It simplifies configuration management and enables easy environment switching (e.g., development, testing, production).

To prevent sensitive data from being pushed to version control, the .env file is ignored by .gitignore.

#### Creating your dotenv file
Copy .env.example to .env
```bash
cp .env.example .env
```
Generate cryptographic strings for token secrets using OpenSSL:
```bash
openssl rand -base64 32
```

Replace DB_USER and DB_PASSWORD with your actual credentials.
Replace the ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET with two different generated strings.
```
DB_HOST=localhost
DB_USER=your_username # Your MySQL username
DB_PASSWORD=your_password # Your MySQL password
DB_NAME_MATH=math_db

ACCESS_TOKEN_SECRET=your_access_token_secret # Secret for signing access tokens
REFRESH_TOKEN_SECRET=your_refresh_token_secret # Secret for signing refresh tokens
```



### Database setup
Creation of the database and tables :
```sql
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME_MATH" < /db_installation/math_db_schema.sql

```

Load sample data for guest access:
```sql
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME_MATH" < /db_installation/math_user_credential_seed.sql
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME_MATH" < /db_installation/math_user_stat_seed.sql
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME_MATH" < /db_installation/math_session_parameters_seed.sql
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME_MATH" < /db_installation/math_session_seed.sql
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME_MATH" < /db_installation/math_answer_seed.sql
```


### Run the App

Start the server:
```bash
node ./app.js
```

# Screenshots
## Dashboard page
![App Screenshot](assets/dashboard_lvl3.png)

## End results
![App Screenshot](assets/end_result.png)
