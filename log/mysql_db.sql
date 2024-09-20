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