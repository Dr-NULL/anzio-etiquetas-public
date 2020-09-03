import { Endpoint } from './lib/endpoint';
import { loadSeeds, SEEDS } from '../seeds';

export const LOAD_SEEDS = new Endpoint()
LOAD_SEEDS.cmd = [ 'seeds' ]
LOAD_SEEDS.callback = async args => {
  await loadSeeds(SEEDS)
}