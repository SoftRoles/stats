//=============================================================================
// modules
//=============================================================================
const { spawn } = require('child_process')
const path = require('path')
const argparse = require('argparse').ArgumentParser

//-------------------------------------
// arguments
//-------------------------------------
const argParser = new argparse({
  addHelp: true,
  description: 'System stats websocket'
})
argParser.addArgument(['-p', '--port'], { help: 'TCP port', defaultValue: '5000' })
const args = argParser.parseArgs()

//=============================================================================
// child process
//=============================================================================
const python = spawn('python', ['index.py']);

python.stdout.on('data', (data) => {
  console.log(`${data}`);
});

python.stderr.on('data', (data) => {
  console.log(`${data}`);
});

python.on('close', (code) => {
  console.log(`python exited with ${code}`);
});