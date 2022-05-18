const connection = require("./config/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const functions = require("./utils/index")

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
        // bonus
        // 'Update Employee Managers',
        // 'View Employees by Manager',
        // 'View Employees by Department',
        // 'Delete Department',
        // 'Delete Role',
        // 'Delete Employee',
        // 'View Totalized Budget of a Department'
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
        // case "Update Employee Managers":
        //   updateManager();
        //   break;
        // case "View Employees by Manager":
        //   viewByManager();
        //   break;
        // case "View Employees by Department":
        //   viewByDept();
        //   break;
        // case "Delete Department":
        //   deleteDept();
        //   break;
        // case "Delete Role":
        //   deleteRole();
        //   break;
        // case "Delete Employee":
        //   deleteEmployee();
        //   break;
        // case "View Totalized Budget of a Department":
        //   viewBudget();
        //   break;
        case "Exit":
          connection.end();
          break;
      }
    });
};

menu();
