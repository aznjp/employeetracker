const inquirer = require("inquirer");
const mysql = require("mysql2");
const Table = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employee"
});

/* This will ensure that through the information above which will locally host the information that 
all query commands that run through it will update the database*/
connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to employee database");
    init();
});

/* The init function will begin the prompted questions to either view, update or delete things from different tables.
This does so through the switch case and the individualized functions shown below*/
function init() {
    inquirer
        .prompt({
            type: "list",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "View Employees by Manager",
                "View Employees by Department",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "View Salaries",
                "Delete Employees",
                "End Application"

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
                    case "View Employees by Manager":
                        employeeManagerTables();
                        break;
                    case "View Employees by Department":
                        employeeDepartmentTables();
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
                        updateEmployeeRole();
                        break;
                    case "Update Employee Manager":
                        updateEmployeeManager();
                        break;
                    case "Delete Employees":
                        deleteEmployee();
                        break;
                    case "View Salaries":
                        salaryTotal();
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
    let departmentQuery = "SELECT * FROM department";
    connection.query(departmentQuery, function(err, res) {
        if (err) throw new Error;
        console.table(res);
        init();
    });
};

function roleTables() {
    let roleQuery = "SELECT * FROM role";
    connection.query(roleQuery, function(err, res) {
        if (err) throw new Error;
        console.table(res);
        init();
    });
};

function employeeTables() {
    // this should show all of the linking information of each employee to their titles, salaries and manager ID's
    let employeeQuery = "SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id";
    connection.query(employeeQuery, function(err, res) {
        if (err) throw new Error;
        console.table(res);
        init();
    });
};

function employeeManagerTables() {
    inquirer
        .prompt({
            type: "input",
            message: "Under which managers do you wish to view employees?",
            name: "managerId",
            validate: function(number) {
                if (isNaN(number)) {
                    console.log("/n Please insert a valid number!")
                    return false;
                } else {
                    return true;
                }
            }
        })
        .then(function(answer) {
            let employeeManagerQuery = "SELECT * FROM employee WHERE manager_id = ?";
            connection.query(employeeManagerQuery, [answer.managerId], function(err, res) {
                if (err) throw new Error;
                console.table(res);
                init();
            });
        });
};

function employeeDepartmentTables() {
    inquirer
        .prompt({
            type: "input",
            message: "Under which department do you wish to view employees?",
            name: "departmentName",

        })
        .then(function(answer) {
            let employeeDeptQuery = "SELECT employee.first_name,employee.last_name,employee.role_id, employee.manager_id, department.name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE name = ?";
            connection.query(employeeDeptQuery, [answer.departmentName], function(err, res) {
                if (err) throw new Error;
                console.table(res);
                init();
            });
        });
}

function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            message: "What is the name of the department?",
            name: "departmentName",
            validate: function(department) {
                if (department.length >= 30) {
                    console.log("/n Please insert a valid department!")
                    return false;
                } else {
                    return true;
                };
            }
        })
        .then(function(answer) {
            connection.query("INSERT INTO department (name) VALUES (?)", [answer.departmentName],
                function(err, res) {
                    if (err) throw new Error;
                    console.table(res);
                    init();
                })
        });
};

function addRole() {
    inquirer
        .prompt([{
                type: "input",
                message: "What's the name of the role? (30 Characters MAX)",
                name: "role",
                validate: function(role) {
                    if (role.length >= 30) {
                        console.log("/n Please insert a valid role!")
                        return false;
                    } else {
                        return true;
                    };
                }
            },
            {
                type: "input",
                message: "What is the salary for this role? (Number values only)",
                name: "salary",
                validate: function(number) {
                    if (isNaN(number)) {
                        console.log("/n Please insert a valid number!")
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            {
                type: "input",
                message: "What is the department id number? (Number values only)",
                name: "departmentId",
                validate: function(number) {
                    if (isNaN(number)) {
                        console.log("/n Please insert a valid number!")
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        ])
        .then(function(answer) {


            connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.role, answer.salary, answer.departmentId],
                function(err, res) {
                    if (err) throw new Error;
                    console.table(res);
                    init();
                });
        });
};

function addEmployee() {
    inquirer
        .prompt([{
                type: "input",
                message: "What is your first name? (30 Characters MAX)",
                name: "firstName",
                validate: function(name) {
                    if (name.length >= 30) {
                        console.log("/n Please insert a valid name!")
                        return false;
                    } else {
                        return true;
                    };
                }
            },
            {
                type: "input",
                message: "What is your last name? (30 Characters MAX)",
                name: "lastName",
                validate: function(name) {
                    if (name.length >= 30) {
                        console.log("/n Please insert a valid name!")
                        return false;
                    } else {
                        return true;
                    };
                }
            },
            {
                type: "input",
                message: "What is your role ID? (Number values only)",
                name: "roleId",
                validate: function(number) {
                    if (isNaN(number)) {
                        console.log("/n Please insert a valid number!")
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            {
                type: "input",
                message: "What is your manager ID? (Number values only)",
                name: "managerId"
            }
        ])
        .then(function(answer) {
            // This is utilized to insert the employee information based on the rows for the first and last name, 
            // their role id values, and the manager values (which can be null if they are the boss)
            connection.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.firstName, answer.lastName, answer.roleId, answer.managerId],
                function(err, res) {
                    if (err) throw new Error;
                    console.table(res);
                    init();
                })
        });
};

function updateEmployeeRole() {
    inquirer
        .prompt([{
                type: "input",
                message: "First Name of the employees information would you like to update?(USE FIRST NAME)",
                name: "firstNameUpdate",
                validate: function(name) {
                    if (name.length >= 30) {
                        console.log("/n Please insert a valid name!")
                        return false;
                    } else {
                        return true;
                    };
                }
            },
            {
                type: "input",
                message: "Last Name of the employees information would you like to update?(USE LAST NAME)",
                name: "lastNameUpdate",
                validate: function(name) {
                    if (name.length >= 30) {
                        console.log("/n Please insert a valid name!")
                        return false;
                    } else {
                        return true;
                    };
                }
            },
            {
                type: "input",
                message: "What is the updated role ID? (MUST BE INTEGER VALUE)",
                name: "roleUpdate",
                validate: function(number) {
                    if (isNaN(number)) {
                        console.log("/n Please insert a valid number!")
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        ])
        .then(function(answer) {
            // Made update function to do it based on first and last name to specify each individual
            connection.query('UPDATE employee SET role_id=? WHERE first_name=? AND last_name=?', [answer.roleUpdate, answer.firstNameUpdate, answer.lastNameUpdate],
                function(err, res) {
                    if (err) throw new Error;
                    console.table(res);
                    init();
                });
        });
};

function updateEmployeeManager() {
    inquirer
        .prompt([{
                type: "input",
                message: "First Name of the employees information would you like to update?(USE FIRST NAME)",
                name: "firstNameUpdate",
                validate: function(name) {
                    if (name.length >= 30) {
                        console.log("/n Please insert a valid name!")
                        return false;
                    } else {
                        return true;
                    };
                }
            },
            {
                type: "input",
                message: "Last Name of the employees information would you like to update?(USE LAST NAME)",
                name: "lastNameUpdate",
                validate: function(name) {
                    if (name.length >= 30) {
                        console.log("/n Please insert a valid name!")
                        return false;
                    } else {
                        return true;
                    };
                }
            },
            {
                type: "input",
                message: "What is the updated manager ID? (MUST BE INTEGER VALUE)",
                name: "managerUpdate",
                validate: function(number) {
                    if (isNaN(number)) {
                        console.log("/n Please insert a valid number!")
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        ])
        .then(function(answer) {
            // Made update function to do it based on first and last name to specify each individual
            connection.query('UPDATE employee SET manager_id=? WHERE first_name=? AND last_name=?', [answer.managerUpdate, answer.firstNameUpdate, answer.lastNameUpdate],
                function(err, res) {
                    if (err) throw new Error;
                    console.table(res);
                    init();
                });
        });
};

function deleteEmployee() {
    inquirer
        .prompt({
            type: "input",
            message: "Which employee do you wish to remove from the database? (USE employee ID number)",
            name: "removeEmployee",
            validate: function(number) {
                if (isNaN(number)) {
                    console.log("/n Please insert a valid number!")
                    return false;
                } else {
                    return true;
                }
            }
        })
        .then(function(answer) {
            // because there is no formal id for employee needed to reference object
            connection.query('DELETE FROM employee WHERE ?', { id: answer.removeEmployee },
                function(err, res) {
                    if (err) throw new Error;
                    console.table(res);
                    init();
                });
        });
};

function salaryTotal() {
    let salaries = "SELECT name,salary FROM role LEFT JOIN department ON role.department_id = department.id"
    connection.query(salaries, function(err, res) {
        if (err) throw new Error;
        console.table(res);
        init();
    });
};


function endApplication() {
    // Ends the connection to the database
    connection.end();
    // Exits the terminal application
    process.exit();
};