#!/usr/bin/env node
const { exec } = require('child_process')
const { Command } = require('commander')
const { stderr } = require('process')
const { SourceTextModule } = require('vm')

const program = new Command()

program.version("0.0.1").description("A cli to open application when type name of aplication")
const huhu =()=> {
  console.log();
}

const getInstalledApplication = (callback) => {
    const command = `reg query "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall" /s /v "DisplayName"`
    exec(command, (err, stdout, stderr) => {
        if( err) {
            console.log(`Error : ${err}`)
            return
        }
        const aplications= []
        const lines = stdout.split('\n')
        lines.forEach(line => {
            const  match = line.match(/DisplayName\s+REG_SZ\s+(.+)/)
            if (match) {
                aplications.push(match[1])
            }
        })
        callback(aplications)
    })
}

program
  .arguments('<app-name>')
  .description('Quickstart an application by its name')
  .action((appName) => {
    if (appName) {
      exec(appName, (err) => {
        if (err) {
          console.error(`Error: ${err}`);
        } else {
          console.log(`${appName} opened successfully.`);
        }
      });
    } else {
      console.error(`Application "${appName}" not found.`);
    }
  });

program
  .command('list-apps')
  .description('List all installed applications')
  .action(() => {
    getInstalledApplication((applications) => {
      console.log('Installed applications:');
      applications.forEach(app => {
        console.log(`- ${app}`);
      });
    });
  });



program.parse(process.argv);