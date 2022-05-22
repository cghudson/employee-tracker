const connection = require("./config/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

connection.connect((error) => {
  if (error) throw error;
  console.log("========================");
  console.log("    EMPLOYEE TRACKER    ");
  console.log("========================");
  menu();
});

const menu = () => {
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.choice) {
        case "View All Departments":
          allDept();
          break;
        case "View All Roles":
          allRoles();
          break;
        case "View All Employees":
          allEmployees();
          break;
        case "Add Department":
          addDept();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "Exit":
          connection.end();
          console.log("==========================");
          console.log("          Goodbye         ");
          console.log("==========================");
          break;
      }
    });
};

const allDept = () => {
  const sql =
    "SELECT departments.id, departments.name AS department FROM departments;";
  connection.query(sql, function (err, res) {
    if (err) throw err;
    console.log("==========================");
    console.log("     All Departments:     ");
    console.log("==========================");
    console.table(res);
    menu();
  });
};

const allRoles = () => {
  const sql =
    "SELECT role.id, role.title, role.salary, departments.name AS department FROM role INNER JOIN departments on role.department_id = departments.id;";
  connection.query(sql, function (err, res) {
    if (err) throw err;
    console.log("=========================");
    console.log("         All Roles:      ");
    console.log("=========================");
    console.table(res);
    menu();
  });
};

const allEmployees = () => {
  const sql =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, departments.name AS 'department', role.salary, concat(manager.first_name, ' ', manager.last_name) as manager FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN departments ON departments.id = role.department_id LEFT JOIN employee manager ON employee.manager_id = manager.id;";
  connection.query(sql, function (err, res) {
    if (err) throw err;
    console.log("========================");
    console.log("     All Employees:     ");
    console.log("========================");
    console.table(res);
    menu();
  });
};

const addDept = () => {
  connection.query("SELECT * FROM departments;", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "deptName",
          type: "input",
          message: "What is the department name?",
        },
      ])
      .then((response) => {
        connection.query(
          "INSERT INTO departments SET ?;",
          {
            name: response.deptName,
          },
          (err) => {
            if (err) throw err;
            console.log("New Department has been added.");
            menu();
          }
        );
      });
  });
};

const addRole = () => {
  connection.query("SELECT * FROM departments;", (err, res) => {
    if (err) {
      throw err;
    }
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "What is the role name?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary for this role?",
        },
        {
          type: "list",
          name: "roleDept",
          message: "What department does this role fall under?",
          choices: res.map((departments) => departments.name),
        },
      ])
      .then((response) => {
        const deptChoice = res.find(
          (departments) => departments.name === response.roleDept
        );
        connection.query(
          "INSERT INTO role SET ?;",
          {
            title: response.name,
            salary: response.salary,
            department_id: deptChoice.id,
          },
          (err) => {
            if (err) {
              throw err;
            }
            console.log("New role has been added.");
            menu();
          }
        );
      });
  });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
    ])
    .then((response) => {
      const first_name = response.firstName;
      const last_name = response.lastName;
      connection
        .promise()
        .query("SELECT * from role;")
        .then(([roles]) => {
          const roleOptions = roles.map((role) => ({
            name: role.title,
            value: role.id,
          }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "roleName",
                message: "What is the employee's role?",
                choices: roleOptions,
              },
            ])
            .then((data) => {
              const role_id = data.roleName;
              connection
                .promise()
                .query("SELECT * from employee where manager_id is Null;")
                .then(([employees]) => {
                  const empOptions = employees.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id,
                  }));
                  empOptions.unshift({
                    name: "None",
                    value: null,
                  });
                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "manager_id",
                        message: "Who is the employee's Manager?",
                        choices: empOptions,
                      },
                    ])
                    .then((answer) => {
                      connection.query(
                        "INSERT INTO employee SET ?;",
                        {
                          first_name: first_name,
                          last_name: last_name,
                          role_id: role_id,
                          manager_id: answer.manager_id,
                        },
                        (err) => {
                          if (err) {
                            throw err;
                          }
                          console.log("New employee has been added.");
                          menu();
                        }
                      );
                    });
                });
            });
        });
    });
};

const updateRole = () => {
  connection.query(`SELECT * FROM employee;`, (err, res) => {
    if (err) {
      throw err;
    }
    inquirer
      .prompt({
        type: "list",
        name: "employeeList",
        message: "Which employee's role would you like to update?",
        choices: res.map(({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id,
        })),
      })
      .then((response) => {
        const employeeChoice = response.employeeList;
        connection.query(`SELECT * FROM role;`, (err, res) => {
          if (err) {
            throw err;
          }
          inquirer
            .prompt({
              type: "list",
              name: "rolesList",
              message: "What is the employee's new role?",
              choices: res.map(({ id, title }) => ({
                name: title,
                value: id,
              })),
            })
            .then((response) => {
              connection
                .promise()
                .query(
                  `UPDATE employee SET role_id = ${response.rolesList} WHERE id = '${employeeChoice}'`
                )
                .then(console.log("Employee role has been updated."))
                .catch((err) => console.log(err));
              menu();
            });
        });
      });
  });
};
