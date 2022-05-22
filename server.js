const connection = require("./config/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

connection.connect((error) => {
  if (error) throw error;
  console.log("Employee Tracker");
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
          console.log("Goodbye");
          break;
      }
    });
};

const allDept = () => {
  const sql = "SELECT departments.id, departments.name AS department FROM departments;"
  connection.query(sql, function (err, res) {
    if (err) throw err;
    console.table("All Departments:", res);
    menu();
  });
};

const allRoles = () => {
  const sql =
    "SELECT role.id, role.title, role.salary, departments.name AS department FROM role INNER JOIN departments on role.department_id = departments.id;";
  connection.query(sql, function (err, res) {
    if (err) throw err;
    console.table("All Roles:", res);
    menu();
  });
};

const allEmployees = () => {
  //need to add manager to table
  const sql =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, departments.name AS 'department', role.salary FROM employee, role, departments WHERE departments.id = role.department_id AND role.id = employee.role_id;";
  connection.query(sql, function (err, res) {
    if (err) throw err;
    console.table("All Employees:", res);
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
  connection.query("SELECT * from role;", (err, res) => {
    if (err) {
      throw err;
    }
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
        {
          type: "list",
          name: "roleName",
          message: "What is the employee's role?",
          choices: res.map((role) => role.title),
        },
        {
          type: "list",
          name: "manager",
          message: "What is the manager's ID number?",
          //placeholder
          choices: ["1", "3", "5", "7"],
        },
      ])
      .then((response) => {
        const roleChoice = res.find((role) => role.title === response.roleName);
        connection.query(
          "INSERT INTO employee SET ?;",
          {
            first_name: response.firstName,
            last_name: response.lastName,
            role_id: roleChoice.id,
            //placeholder - comes back as null
            manager_id: response.manager_id,
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
        choices: res.map((chosenEmployee) => chosenEmployee.first_name),
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
              choices: res.map((roleChoice) => roleChoice.title),
            })
            .then((response) => {
              const updatedRole = res.find(
                (roleChoice) => roleChoice.title === response.rolesList
              );
              connection
                .promise()
                .query(
                  `UPDATE employee SET role_id = ${updatedRole.id} WHERE first_name = '${employeeChoice}'`
                )
                .then(console.log("Employee role has been updated."))
                .catch((err) => console.log(err));

              menu();
            });
        });
      });
  });
};
