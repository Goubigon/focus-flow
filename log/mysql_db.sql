CREATE DATABASE math_db;

CREATE TABLE answers (
    ID INT AUTO_INCREMENT PRIMARY KEY, 

    leftOperation INT(10) NOT NULL,
    mathOperation CHAR(1) NOT NULL CHECK (mathOperation IN ('+', '-', 'x')),
    rightOperation INT(10) NOT NULL,

    qResult FLOAT(24) NOT NULL,
    qAnswer FLOAT(24) NOT NULL,
    isCorrect BOOLEAN NOT NULL, -- 0 == False, anything else == True

    qTime FLOAT(5, 2) NOT NULL, -- Stores time with 2 decimal places (e.g., 5.65 seconds)
    qDate DATETIME NOT NULL, -- Stores the date and time (format: yyyy:mm:dd hh:mm:ss)

    minNumber FLOAT(24) NOT NULL,
    maxNumber FLOAT(24) NOT NULL,
    floatNumber INT(10) NOT NULL,
    nNumber INT(10) NOT NULL,

    additionCheck BOOLEAN NOT NULL,
    subtractionCheck BOOLEAN NOT NULL,
    multiplicationCheck BOOLEAN NOT NULL
);

+---------------------+------------+------+-----+---------+----------------+
| Field               | Type       | Null | Key | Default | Extra          |
+---------------------+------------+------+-----+---------+----------------+
| ID                  | int        | NO   | PRI | NULL    | auto_increment |
| leftOperation       | int        | NO   |     | NULL    |                |
| mathOperation       | char(1)    | NO   |     | NULL    |                |
| rightOperation      | int        | NO   |     | NULL    |                |
| qResult             | float      | NO   |     | NULL    |                |
| qAnswer             | float      | NO   |     | NULL    |                |
| isCorrect           | tinyint(1) | NO   |     | NULL    |                |
| qTime               | float(5,2) | NO   |     | NULL    |                |
| qDate               | datetime   | NO   |     | NULL    |                |
| minNumber           | float      | NO   |     | NULL    |                |
| maxNumber           | float      | NO   |     | NULL    |                |
| floatNumber         | int        | NO   |     | NULL    |                |
| nNumber             | int        | NO   |     | NULL    |                |
| additionCheck       | tinyint(1) | NO   |     | NULL    |                |
| subtractionCheck    | tinyint(1) | NO   |     | NULL    |                |
| multiplicationCheck | tinyint(1) | NO   |     | NULL    |                |
+---------------------+------------+------+-----+---------+----------------+

INSERT INTO Answers (
    leftOperation, mathOperation, rightOperation, 
    qResult, qAnswer, isCorrect, 
    qTime, qDate, 
    minNumber, maxNumber, floatNumber, nNumber,
    additionCheck, subtractionCheck, multiplicationCheck)
VALUES (
    2, '+', 3, 
    8.0, 8.0, 1, 
    5.65, '2024-09-18 12:34:56', 
    0.0, 10.0, 0.0, 2, 
    '1', '1', '0');

SELECT * FROM Answers\G --vertical output

SELECT 
    CONCAT(leftOperation, mathOperation, rightOperation) AS expression,
    COUNT(*) AS totalCount,
    SUM(CASE WHEN isCorrect = 1 THEN 1 ELSE 0 END) AS correctCount,
    SUM(CASE WHEN isCorrect = 0 THEN 1 ELSE 0 END) AS incorrectCount
FROM 
    answers
WHERE 
    qResult = 72
GROUP BY 
    expression;


-----------------

CREATE TABLE math_user_credential (
    mUserIdentifier INT AUTO_INCREMENT PRIMARY KEY,

    mUsername VARCHAR(255) NOT NULL,
    mEmail VARCHAR(255) NOT NULL UNIQUE,
    mHashedPassword VARCHAR(255) NOT NULL,
    mRole ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    mCreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

+-----------------+----------------------+------+-----+-------------------+-------------------+
| Field           | Type                 | Null | Key | Default           | Extra             |
+-----------------+----------------------+------+-----+-------------------+-------------------+
| mUserIdentifier | int                  | NO   | PRI | NULL              | auto_increment    |
| mUsername       | varchar(255)         | NO   |     | NULL              |                   |
| mEmail          | varchar(255)         | NO   | UNI | NULL              |                   |
| mHashedPassword | varchar(255)         | NO   |     | NULL              |                   |
| mRole           | enum('admin','user') | NO   |     | user              |                   |
| mCreationDate   | timestamp            | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+-----------------+----------------------+------+-----+-------------------+-------------------+


INSERT INTO math_user (mUsername, mEmail, mHashedPassword, mRole)
VALUES ('john_doe', 'john@example.com', 'hashedPassword123', 'user');


INSERT INTO math_user (mUsername, mEmail, mHashedPassword, mRole)
VALUES ('leo', 'leo@example.com', 'ppp123', 'admin');

-----------------
CREATE TABLE math_user_stat (
    mUserIdentifier INT NOT NULL PRIMARY KEY,
    mSessionCount INT DEFAULT 0,
    mLastSessionDate DATE,
    mTotalSessionTime INT DEFAULT 0, -- in milliseconds
    FOREIGN KEY (mUserIdentifier) REFERENCES math_user_credential(mUserIdentifier)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

+-------------------+----------+------+-----+---------+-------+
| Field             | Type     | Null | Key | Default | Extra |
+-------------------+----------+------+-----+---------+-------+
| mUserIdentifier   | int      | NO   | PRI | NULL    |       |
| mSessionCount     | int      | YES  |     | 0       |       |
| mLastSessionDate  | datetime | YES  |     | NULL    |       |
| mTotalSessionTime | int      | YES  |     | 0       |       |
+-------------------+----------+------+-----+---------+-------+


--- mUserIdentifier is foreign key, so it needs to exist in math_user_credential
--- if that user is deleted in math_user_credential, all its lines in math_user_stat will be deleted (On DELETE/UPDATE CASCADE) 
INSERT INTO math_user_stat (mUserIdentifier, mSessionCount, mLastSessionDate, mTotalSessionTime)
VALUES (36, 5, '2024-10-05 00:00:00', 3600000);




-----------------

CREATE TABLE math_session (
    mSessionIdentifier INT AUTO_INCREMENT PRIMARY KEY,
    mUserIdentifier INT NOT NULL,
    mParametersIdentifier INT NOT NULL,  -- New foreign key column
    mSessionDuration INT DEFAULT 0, -- in milliseconds
    mSessionDate DATETIME,
    FOREIGN KEY (mUserIdentifier) REFERENCES math_user_credential(mUserIdentifier)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (mParametersIdentifier) REFERENCES math_session_parameters(mParametersIdentifier)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);



+-----------------------+----------+------+-----+---------+----------------+
| Field                 | Type     | Null | Key | Default | Extra          |
+-----------------------+----------+------+-----+---------+----------------+
| mSessionIdentifier    | int      | NO   | PRI | NULL    | auto_increment |
| mUserIdentifier       | int      | NO   | MUL | NULL    |                |
| mParametersIdentifier | int      | NO   | MUL | NULL    |                |
| mSessionDuration      | int      | YES  |     | 0       |                |
| mSessionDate          | datetime | YES  |     | NULL    |                |
+-----------------------+----------+------+-----+---------+----------------+


INSERT INTO math_session (mUserIdentifier, mSessionDuration, mSessionDate)
VALUES (35, 3600000, '2024-10-05 00:00:00');

-----------------

CREATE TABLE math_session_parameters (
    mParametersIdentifier INT AUTO_INCREMENT PRIMARY KEY,
    mMinNumber INT DEFAULT 0,
    mMaxNumber INT DEFAULT 10,
    mFloatNumber INT DEFAULT 0,
    mNumber INT DEFAULT 2,
    mAdditionCheck BOOLEAN DEFAULT TRUE,
    mSubtractionCheck BOOLEAN DEFAULT TRUE,
    mMultiplicationCheck BOOLEAN DEFAULT TRUE,
    mMaxAnswerCount INT DEFAULT 0
);

+-----------------------+------------+------+-----+---------+----------------+
| Field                 | Type       | Null | Key | Default | Extra          |
+-----------------------+------------+------+-----+---------+----------------+
| mParametersIdentifier | int        | NO   | PRI | NULL    | auto_increment |
| mMinNumber            | int        | YES  |     | 0       |                |
| mMaxNumber            | int        | YES  |     | 10      |                |
| mFloatNumber          | int        | YES  |     | 0       |                |
| mNumber               | int        | YES  |     | 2       |                |
| mAdditionCheck        | tinyint(1) | YES  |     | 1       |                |
| mSubtractionCheck     | tinyint(1) | YES  |     | 1       |                |
| mMultiplicationCheck  | tinyint(1) | YES  |     | 1       |                |
| mMaxAnswerCount       | int        | YES  |     | 0       |                |
+-----------------------+------------+------+-----+---------+----------------+

INSERT INTO math_session_parameters (mMinNumber, mMaxNumber, mFloatNumber, mNumber, mAdditionCheck, mSubtractionCheck, mMultiplicationCheck, mMaxAnswerCount)
VALUES (-10, 10, 0, 2, TRUE, TRUE, FALSE, 20);

INSERT INTO math_session_parameters (mMinNumber, mMaxNumber, mFloatNumber, mNumber, mAdditionCheck, mSubtractionCheck, mMultiplicationCheck, mMaxAnswerCount)
VALUES (-10, 10, 0, 2, TRUE, TRUE, FALSE, 20);

SELECT mParametersIdentifier FROM math_session_parameters
WHERE mMinNumber = -10 AND
 mMaxNumber = 10 AND
 mFloatNumber = 0 AND
 mNumber = 2 AND
 mAdditionCheck = TRUE AND
 mSubtractionCheck = TRUE AND
 mMultiplicationCheck = FALSE AND
 mMaxAnswerCount = 20;