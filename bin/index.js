#!/usr/bin/env node

import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { exec, execSync } from "child_process";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const command = process.argv[2];
const input = process.argv[3];

const init_function = (prompt) => {
  const projectName = prompt.projectName;
  const targetDir = path.join(process.cwd(), projectName);
  const templateDir = path.join(__dirname, "../template");

  if (fs.existsSync(targetDir)) {
    console.error(
      chalk.red(
        `Project directory ${projectName} already exists. Please choose a different name.`
      )
    );
    return;
  }

  console.log(chalk.yellow(`Creating Flask project: ${projectName}...`));
  fs.mkdirSync(targetDir, { recursive: true });
  fs.cpSync(templateDir, targetDir, { recursive: true });
  console.log(chalk.green(`Project ${projectName} created successfully.`));

  console.log(chalk.cyan("Creating virtual environment..."));
  execSync(`python -m venv venv`, { cwd: targetDir, stdio: "inherit" });

  console.log(chalk.cyan("Downloading dependencies..."));
  const dependencies = prompt.dependencies;
  execSync(`venv\\Scripts\\pip install flask ${dependencies.join(" ")}`, {
    cwd: targetDir,
    stdio: "inherit",
  });
  execSync(`venv\\Scripts\\pip freeze > requirements.txt`, {
    cwd: targetDir,
    stdio: "inherit",
  });
  console.log(chalk.green("Dependencies installed successfully."));
};

if (command === "init") {
  inquirer
    .prompt([
      {
        name: "projectName",
        type: "input",
        message: "Enter the flask project name:",
        validate: (input) =>
          input.trim() === "" ? "Enter a valid project name." : true,
      },
      {
        name: "dependencies",
        type: "checkbox",
        message: "Select the dependencies you want to install:",
        choices: [
          "flask-sqlalchemy",
          "flask-login",
          "flask-cors",
          "flask-migrate",
          "flask-restful",
          "flask-jwt-extended",
          "flask-mail",
          "flask-wtf",
          "flask-bcrypt",
          "flask-debugtoolbar",
        ],
      },
    ])
    .then(init_function);
}


if (command === "install") {
  if (!input) {
    console.error(chalk.red("Please specify the dependencies to install."));
    process.exit(1);
  }

  const dependencies = input.split(",").map((dep) => dep.trim());
  const targetDir = process.cwd();

  console.log(chalk.cyan("Installing dependencies..."));
  try {
    execSync(`venv\\Scripts\\pip install ${dependencies.join(" ")}`, {
      cwd: targetDir,
      stdio: "inherit",
    });
    execSync(`venv\\Scripts\\pip freeze > requirements.txt`, {
      cwd: targetDir,
      stdio: "inherit",
    });
    console.log(chalk.green("Dependencies installed successfully."));
  } catch (error) {
    console.error(chalk.red("Error installing dependencies:"), error.message);
  }
}

if (command === "route") {
  const method = process.argv[3];
  const routePath = process.argv[4];
  const targetDir = process.cwd();

  if (!method || !routePath) {
    console.error(chalk.red("Please specify the HTTP method and route path."));
    process.exit(1);
  }

  const appFile = path.join(targetDir, "app.py");
  let content = fs.readFileSync(appFile, "utf8");

  const functionName = `handle_${method.toLowerCase()}_${routePath.replace(/\//g, "_")}`;
  const mainBlock = "if __name__ == '__main__':";
  const index = content.indexOf(mainBlock);

  if (index === -1) {
    console.log("Could not find main block in app.py");
    process.exit(1);
  }

  const routeCode =
    `\n\n@app.route('${routePath}', methods=['${method.toUpperCase()}'])\n` +
    `def ${functionName}():\n    return "Hello from ${method.toUpperCase()} ${routePath}"\n`;

  const newContent =
    content.slice(0, index) + routeCode + "\n" + content.slice(index);

  fs.writeFileSync(appFile, newContent, "utf8");

  console.log(
    chalk.green(
      `✅ Route ${method.toUpperCase()} ${routePath} added successfully.`
    )
  );
}

if (command === "run") {
  const targetDir = process.cwd();
  execSync(`venv\\Scripts\\python app.py`, {
    stdio: "inherit",
    cwd: targetDir,
  });
}

if (["help", "--help", "-h", "--h", "--H", "h", "H"].includes(command)) {
  console.log(
    chalk.blue(`
Usage: flaskcli <command> [options]

Commands:
  init                  Initialize a new Flask project.
  install <deps>        Install dependencies to the current project.
  route <method> <path> Add a new route to app.py
  help                  Show this help message.
  run                   Run the Flask Application

Options:
  --dependencies        Specify additional dependencies to install (comma-separated).
`)
  );
} else if (!["init", "install", "route"].includes(command)) {
  console.error(
    chalk.red("❌ Unknown command. Use 'flaskcli help' for usage information.")
  );
}
