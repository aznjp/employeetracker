const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    // Your port
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "Azngirls1#",
    database: "employee"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to employee database");

    init();
});

function init() {
    inquirer
        .prompt({
            type: "list",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Delete Employees"
            ],
            message: "What do you want to do?",
            name: "actions"
        })
        .then(
            function(answers) {
                switch (answers.actions) {
                    case "View All Departments":
                        departmentTables();
                        break;
                    case "View All Roles":
                        roleTables();
                        break;
                    case "View All Employees":
                        employeeTables();
                        break;
                    case "Add Department":
                        addDepartment();
                        break;
                    case "Add Role":
                        addRole();
                        break;
                    case "Add Employee":
                        addEmployee();
                        break;
                    case "Update Employee Role":
                        updateEmployee();
                        break;
                    case "Delete Employees":
                        deleteEmployee();
                        break;
                    case "End Application":
                        endApplication();
                        break;
                    default:
                        init();
                }
            })
}

function departmentTables() {

};

function roleTables() {

};

function employeeTables() {

};

function addDepartment() {
    inquirer
        .prompt([{
                type: "input",
                message: "What is your first name?",
                name: "firstName"
            },
            {
                type: "input",
                message: "What is your last name?",
                name: "lastName"
            },
            {
                type: "input",
                message: "What is your role ID?",
                name: "roleId"
            },
            {
                type: "input",
                message: "What is your manager ID?",
                name: "managerId"
            }
        ])
        .then(function(answer) {

            connection.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.firstName, answer.lastName, answer.roleId, answer.managerId],
                function(err, res) {
                    if (err) throw new Error;
                    cTable(res);
                    init();
                })
        });

    function addRole();

    function addEmployee();

    function updateEmployee() {
        inquirer
            .prompt([{
                    type: "input",
                    message: "Which of the employees information would you like to update?",
                    name: "employeeUpdate"
                },

            ])
    };

    function deleteEmployee();

    function endApplication();