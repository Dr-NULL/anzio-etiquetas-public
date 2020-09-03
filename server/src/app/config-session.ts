import { deploy } from 'session-crossover';
import { resolve } from 'path';

import { APP_CONFIG } from '..';
import { APP } from '.';

export function configSession() {
  APP.use(deploy({
    path: resolve('..', APP_CONFIG.folder.session),
    cookieName: APP_CONFIG.server.cookieSession,
    // aesType: 'aes-256-gcm',
    expires: 30,
  }))
}