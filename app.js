const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const writeFileAsync = util.promisify(fs.writeFile)

const managerQuestions = [
    {
        type: "input",
        name: "name",
        message: "Enter manager's name: ",
    },
    {
        type: "input",
        name: "id",
        message: "Enter manager's id: ",
    },
    {
        type: "input",
        name: "email",
        message: "Enter manager's email: "
    },
    {
        type: "input",
        name: "officeNumber",
        message: "Enter manager's office number: "
    },
    {
        type: "list",
        name: "newMember",
        message: "Would you like to add a new team member?",
        choices: ["Yes","No"],
    },
]

 const employeeQuestions = [
    {
        type: "input",
        name: "name",
        message: "Enter employee's name: ",
    },
    {
        type: "input",
        name: "id",
        message: "Enter employee's id: ",
    },
    {
        type: "input",
        name: "email",
        message: "Enter employee's email: "
    },
    {
        type: "list",
        name: "employeeRole",
        message: "What is their role?",
        choices: ["Engineer", "Intern"],
    },
    {
        when: answer => (answer.employeeRole == "Engineer"),
        type: "input",
        name: "github",
        message: "Enter engineer's github: "
    },
    {
        when: answer => (answer.employeeRole == "Intern"),
        type: "input",
        name: "school",
        message: "Enter intern's school: ",
    },
    {
        type: "list",
        name: "newMember",
        message: "Would you like to add a new team member?",
        choices: ["Yes","No"],
    },
]

var teamMembers = []

function addNewMember () {
    inquirer.prompt(employeeQuestions).then(employeeInput => {
        if (employeeInput.employeeRole == "Engineer") {
            var newMember = new Engineer (employeeInput.name, employeeInput.id, employeeInput.email, employeeInput.github);
        }
        else {
            var newMember = new Intern (employeeInput.name, employeeInput.id, employeeInput.email, employeeInput.school);
        }
        teamMembers.push(newMember);
        if (employeeInput.newMember === "Yes") {
            addNewMember();
        }
        else {
            console.log ("Finished");
            createHTML();
        }
    })
}

function createTeam () {
    inquirer.prompt(managerQuestions).then(managerInput => {
        var newManager = new Manager (managerInput.name, managerInput.id, managerInput.email, managerInput.officeNumber);
        teamMembers.push(newManager);
        if (managerInput.newMember == "Yes") {
            addNewMember ();
        }
        else {
            console.log ("Finished");
            createHTML();
        }
    })
}

function createHTML() {
    writeFileAsync(outputPath, render(teamMembers));
}
    

    

createTeam();