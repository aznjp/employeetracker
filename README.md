# Employee Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

* [Description](#Description)
* [Installation](#Installation)
* [Usage](#Usage)
* [License](#License)
* [Contributing](#Contributing)
* [Test](#Test)

## Description
As a business owner I want to be able to view and manage the departments, roles, and employees in my company so that I can organize and plan my business. This CLI (Command Line Interface) application will take and inject information to and from the database employee.db once sourced from schema and seeds files. 

## Installation

To initiate the application you must install the inquirer, MySQL2 and console.table module and its JSON files

    npm install inquirer
    npm install --save mysql2
    npm install console.table --save

Once this is finished check your package.json file ensure that these are saved to your dependency section.

## Usage
The application will first begin with a series of questions as shown below

![Employee Tracker](./assets/images/screenshot1.PNG)

The application will then be able to view, update, delete and add information to different tables within the database. (Table scheme is shown below)

![Employee Tracker2](./assets/images/screenshot2.png)

To see a demonstration to the application run click on the image below

[![Employee Tracker](http://img.youtube.com/vi/jCYn_GqvwLg/0.jpg)](http://www.youtube.com/watch?v=jCYn_GqvwLg "https://miro.medium.com/max/1200/1*Oe7xavCj5qCBzwTbLDbPTg.jpeg")

## License
MIT  

## Badges
![badmath](https://img.shields.io/github/languages/top/nielsenjared/badmath)

## Contributing
For anyone who wishes to contribute you can contact me with the information below

## Test
The database was checked in the terminal via the command:

    mysql -u root -p
    show database;
    SELECT * FROM employee;
    SELECT * FROM role;
    SELECT * FROM department;

Once they have been tested after the inquirer module was used it was ensured that the tables have been altared or deleted
    
Would you like to reach us?
</br>
Contact Me:

Github: https://github.com/aznjp

Email: Jpark103193@gmail.com
