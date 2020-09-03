import express from 'express';
import { createServer } from 'http';
import { createConnection, Connection } from 'typeorm';
import { AESCrypto } from '../tool/aes-crypto';
import { Loop, sleep } from '../tool/time';

export const AES = AESCrypto.load()
export const APP = express()
export const LOOP = new Loop()
export const HTTP = createServer(APP)
export let orm: Connection

import { Log } from '../tool/log';
import { APP_CONFIG } from '..';

// Configuration Callbacks
import { configJson } from './config-json';
import { configError } from './config-error';
import { configRouter } from './config-router';
import { configSession } from './config-session';
import { configAngular } from './config-angular';
import { configTypeORM } from './config-typeorm';
import { configLoop } from './config-loop';
import { Arguments } from '../args/lib/arguments';

export async function startServer() {
  // Deploy TypeORM
  orm = await configTypeORM()
  
  // Configuring the Server
  configJson()
  configSession()
  configAngular()
  configRouter()
  configError()
  // configLoop()

  // Initialize the Server
  HTTP.listen(APP_CONFIG.server.port, '0.0.0.0', () => {
    Log.title('Normaliz. Etiquetas')
    Log.ok('Inicialización completada!')

    const arg = new Arguments()
    if (arg.find('system', 'sys')) {
      Log.ev(
        'Se ha establecido iniciar sesión de forma ',
        'automática con el usuario tipo system. Proceda',
        'con precaución...\n'
      )
    }
  })
}