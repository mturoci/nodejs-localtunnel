import 'localenv'
import optimist from 'optimist'

import log from 'book'
import Debug from 'debug'
import fs from 'fs'

import CreateServer from '../server.js'

const debug = Debug('localtunnel')
const readFile = path => {
  try {
    return fs.readFileSync(path)
  } catch (error) {
    console.error(`Failed to read file: ${path}`)
  }
}

const argv = optimist
  .usage('Usage: $0 --port [num]')
  .options('secure', {
    default: false,
    describe: 'use this flag to indicate proxy over https'
  })
  .options('port', {
    default: '80',
    describe: 'listen on this port for outside requests'
  })
  .options('address', {
    default: '0.0.0.0',
    describe: 'IP address to bind to'
  })
  .options('domain', {
    describe: 'Specify the base domain name. This is optional if hosting localtunnel from a regular example.com domain. This is required if hosting a localtunnel server from a subdomain (i.e. lt.example.dom where clients will be client-app.lt.example.come)',
  })
  .options('max-sockets', {
    default: 10,
    describe: 'maximum number of tcp sockets each client is allowed to establish at one time (the tunnels)'
  })
  .options('ip', {
    default: undefined,
    describe: 'IP address to inform to client'
  })
  .options('ssl-cert', {
    describe: 'Path to SSL certificate',
  })
  .options('ssl-key', {
    describe: 'Path to SSL key',
  })
  .argv

if (argv.help) {
  optimist.showHelp()
  process.exit()
}

const server = CreateServer({
  max_tcp_sockets: argv['max-sockets'],
  secure: argv.secure,
  domain: argv.domain,
  ip: argv.ip,
  sslCert: readFile(argv['ssl-cert']),
  sslKey: readFile(argv['ssl-key']),
})

server.listen(argv.port, argv.address, () => debug('server listening on port: %d', server.address().port))
process.on('SIGINT', () => process.exit())
process.on('SIGTERM', () => process.exit())
process.on('uncaughtException', err => log.error(err))
process.on('unhandledRejection', (reason, promise) => log.error(reason))

// vim: ft=javascript