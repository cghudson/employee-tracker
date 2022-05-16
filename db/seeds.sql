INSERT INTO departments (name)
VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES 
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Account Manager', 150000, 3),
('Accountant', 125000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Mary', 'Smith', 1, NULL), 
('James', 'Johnson', 2, 1),
('Maria', 'Garcia', 3, NULL),
('John', 'Smith', 4, 3),
('Michael', 'Jones', 5, NULL),
('Robert', 'Barry', 6, 5),
('Elizabeth', 'Hart', 7, NULL),
('David', 'Martinez', 8, 7);