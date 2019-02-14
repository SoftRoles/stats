//=============================================================================
// modules
//=============================================================================
const { spawn } = require('child_process')
const argparse = require('argparse').ArgumentParser
const websocket = require('ws')

//-------------------------------------
// arguments
//-------------------------------------
const argParser = new argparse({
  addHelp: true,
  description: 'System stats websocket'
})
argParser.addArgument(['-p', '--port'], { help: 'TCP port', defaultValue: '5000' })
const args = argParser.parseArgs()

//-------------------------------------
// websocket httpServer
//-------------------------------------
const server = new websocket.Server({ port: Number(args.port) })
server.on('connection', (client, req)=>{
  client.isAlive = true
  // client.spawn = spawn('python', ['index.py']);
  console.log((req.headers['x-forwarded-for'] && req.headers['x-forwarded-for'].split(/\s*,\s*/)[0]) || req.connection.remoteAddress)
})

//=============================================================================
// child process
//=============================================================================
const python = spawn('python', ['index.py']);

python.stdout.on('data', (data) => {
  server.clients.forEach(client=>{
    if(client.readyState === websocket.OPEN) client.send(`${data}`)
  })
});

python.stderr.on('data', (data) => {
  console.log(`${data}`);
});

python.on('close', (code) => {
  console.log(`python exited with ${code}`);
});

//=============================================================================
// start socket
//=============================================================================
