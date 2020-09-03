import { Endpoint } from './lib/endpoint';
import { startServer } from '../app';

export const DEPLOY_SERVER = new Endpoint()
DEPLOY_SERVER.cmd = [ 'server' ]
DEPLOY_SERVER.callback = async args => {
  await startServer()
}