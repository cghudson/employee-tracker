const connection = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

connection.connect((error) => {
  if (error) throw error;
  console.log("Employee Tracker");
  menu();
});

const menu = () => {
  inquirer.prompt({
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
    ],
  });
};
