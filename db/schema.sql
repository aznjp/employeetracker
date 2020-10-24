DROP DATABASE IF EXISTS employee;
CREATE DATABASE employee;
USE employee;

-- note to self: make sure when using foreign keys to have all properties be the same for referencing
-- note to self: ensure delete on cascade command to make sure it will delete the entirety of that data owners info if they are taken out

CREATE TABLE department (
id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
name VARCHAR(30) NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE role (
id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
title VARCHAR (30) NOT NULL,
salary DECIMAL NOT NULL,
department_id INTEGER UNSIGNED NOT NULL,
CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE,
PRIMARY KEY (id)
);

CREATE TABLE employee (
id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INTEGER UNSIGNED NOT NULL,
CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
manager_id INTEGER UNSIGNED,
CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE,
PRIMARY KEY (id)
);