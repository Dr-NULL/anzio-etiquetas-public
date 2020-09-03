import { Endpoint } from './lib/endpoint';
import { execTest } from '../test';

export const TEST = new Endpoint()
TEST.cmd = [ 'test' ]
TEST.callback = args => {
  execTest()
}