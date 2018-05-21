declare var MOONGLOW_SERVER_MODE: boolean

function isServerMode(): boolean {
  return MOONGLOW_SERVER_MODE
}

export {isServerMode}
