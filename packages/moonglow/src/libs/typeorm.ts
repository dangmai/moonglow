import * as path from 'path'

import {Connection, createConnection} from 'typeorm'

export function getDatabaseConfigs(): any {
  const bootstrap = require(path.resolve(process.cwd(), './.moonglow/server/bootstrap'))
  return bootstrap.getProjectConfigs().database
}

let _connection: Connection

export async function getConnection() {
  if (!_connection) {
    const databaseConfigs = getDatabaseConfigs()
    _connection = await createConnection(databaseConfigs)
  }
  return _connection
}
