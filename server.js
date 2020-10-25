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
                "No Manager",
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
                    case "No Manager":
                        noManager();
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
    let departmentQuery = `SELECT department.name AS Department_Name,department.id AS Department_ID  
    FROM department`;
    connection.query(departmentQuery, function(err, res) {
        if (err) throw new Error;
        console.table(res);
        init();
    });
};

function roleTables() {
    let roleQuery = `SELECT  role.id AS Role_ID, role.title AS Job_Title, role.department_id AS Department_ID, role.salary AS Salary  
    FROM role`;
    connection.query(roleQuery, function(err, res) {
        if (err) throw new Error;
        console.table(res);
        init();
    });
};

function employeeTables() {
    // this should show all of the linking information of each employee to their titles, salaries and manager ID's
    let employeeQuery =
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;
    connection.query(employeeQuery, function(err, res) {
        if (err) throw new Error;
        console.table(res);
        init();
    });
};

function employeeManagerTables() {
    let employeeManagerQuery =
        `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS Manager, department.name AS Department, employee.id AS employee_id, employee.first_name, employee.last_name, role.title
        FROM employee
        LEFT JOIN employee manager on manager.id = employee.manager_id
        INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
        INNER JOIN department ON (department.id = role.department_id)
        ORDER BY manager;`;
    connection.query(employeeManagerQuery, function(err, res) {
        if (err) throw new Error;
        console.table(res);
        init();
    });
}

function employeeDepartmentTables() {

    let employeeDeptQuery = `SELECT employee.first_name,employee.last_name,role.title AS Job_title, employee.manager_id AS Manager_ID, department.name AS Department
    FROM employee 
    INNER JOIN role ON employee.role_id = role.id 
    INNER JOIN department ON role.department_id = department.id`;
    connection.query(employeeDeptQuery, function(err, res) {
        if (err) throw new Error;
        console.table(res);
        init();
    })
};

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
    let deptQuery = `SELECT * FROM department`
    connection.query(deptQuery,
        function(err, res) {
            if (err) throw new Error;
            const departments = res.map(({ id, name }) => ({ name: name, value: id }));
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
                        type: "list",
                        message: "Which department will it be under?)",
                        choices: departments,
                        name: "departmentId"
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
        });
}

function addEmployee() {
    // Initial search to get back to roles and make list of current job titles and map them back to their id values
    const roleQuery = `SELECT role.id, role.title FROM role`;
    connection.query(roleQuery, (err, res) => {
        if (err) throw new Error;
        const roles = res.map(({ id, title }) => ({ name: title, value: id }));

        // Initial search to get back to employee and make list of current managers and map them back to their id values
        const managerQuery = `SELECT * FROM employee`;
        connection.query(managerQuery, (err, res) => {
            if (err) throw new Error;
            const managers = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

            // Will then prompt back to the initial prompt questions for this function
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
                        type: "list",
                        message: "What is your role?",
                        name: "roleId",
                        choices: roles
                    },
                    {
                        type: "list",
                        message: "What is your manager name?",
                        name: "managerId",
                        choices: managers
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
        })
    });
}

function updateEmployeeRole() {
    // Initial search to get back to employee and make list of current managers and map them back to their id values
    const roleQuery = `SELECT role.id, role.title FROM role`;
    connection.query(roleQuery, (err, res) => {
        if (err) throw new Error;
        const roles = res.map(({ id, title }) => ({ name: title, value: id }));

        const fullNameQuery = `SELECT * FROM employee`;
        connection.query(fullNameQuery, (err, res) => {
            if (err) throw new Error;
            const updateEmployee = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

            inquirer
                .prompt([{
                        type: "list",
                        message: "First Name of the employees information would you like to update?(USE FIRST NAME)",
                        name: "fullNameUpdate",
                        choices: updateEmployee
                    },
                    {
                        type: "list",
                        message: "What is the updated role ID? (MUST BE INTEGER VALUE)",
                        name: "roleUpdate",
                        choices: roles
                    }
                ])
                .then(function(answer) {
                    // Made update function to do it based on first and last name to specify each individual
                    connection.query('UPDATE employee SET role_id=? WHERE employee.id = ?', [answer.roleUpdate, answer.fullNameUpdate],
                        function(err, res) {
                            if (err) throw new Error;
                            console.table(res);
                            init();
                        });
                });
        })
    })
};

function updateEmployeeManager() {
    // Could have just referenced through the first query, but this makes it easier to read that it is also getting employee id
    const employeeQuery = `SELECT * FROM employee`;
    connection.query(employeeQuery, (err, res) => {
        if (err) throw new Error;
        const employee = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        // Initial search to get back to employee and make list of current managers and map them back to their id values
        const managerQuery = `SELECT * FROM employee`;
        connection.query(managerQuery, (err, res) => {
            if (err) throw new Error;
            const managers = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
            inquirer
                .prompt([{
                        type: "list",
                        message: "First Name of the employees information would you like to update?(USE FIRST NAME)",
                        name: "fullNameUpdate",
                        choices: employee
                    },
                    {
                        type: "list",
                        message: "What is the updated manager ID?",
                        name: "managerUpdate",
                        choices: managers
                    }
                ])
                .then(function(answer) {
                    // Made update function to do it based on first and last name to specify each individual
                    connection.query('UPDATE employee SET manager_id=? WHERE employee.id=?', [answer.managerUpdate, answer.fullNameUpdate],
                        function(err, res) {
                            if (err) throw new Error;
                            console.table(res);
                            init();
                        });
                });
        })
    })
};

function noManager() {
    const noManagerQuery = `SELECT * FROM employee`;
    connection.query(noManagerQuery, (err, res) => {
        if (err) throw new Error;
        const noManager = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
        inquirer
            .prompt([{
                type: "list",
                message: "Which employee has no manager?",
                name: "noManager",
                choices: noManager
            }])
            .then(function(answer) {
                connection.query('UPDATE employee SET manager_id = NULL WHERE employee.id =?', [answer.noManager],
                    function(err, res) {
                        if (err) throw new Error;
                        console.table(res);
                        init();
                    });
            })

    })
}

function deleteEmployee() {
    const deleteEmployeeQuery = `SELECT * FROM employee`;
    connection.query(deleteEmployeeQuery, (err, res) => {
        if (err) throw new Error;
        const deleteEmployees = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
        inquirer
            .prompt({
                type: "list",
                message: "Which employee do you wish to remove from the database? (USE employee ID number)",
                name: "removeEmployee",
                choices: deleteEmployees

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
    });
}

function salaryTotal() {
    let salaries =
        `SELECT name,salary 
    FROM role 
    LEFT JOIN department 
    ON role.department_id = department.id`
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