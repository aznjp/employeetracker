INSERT INTO department (name)
VALUES ("Human Resources"), ("R&D"), ("Engineering"), ("Accounting"), ("Sales");

INSERT INTO role (title, salary, department_id)
VALUE ("manager", 125000, 1), ("scientist", 57500, 2),("engineer", 65000, 3),("accountant", 82500, 4) ,  ("sales person", 85650, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Roy", "Mustang", 1, null), ("Edward", "Elric", 2, 1), ("Alphonse", "Elric", 4, 2), ("Winry", "Rockbell", 3, 2);