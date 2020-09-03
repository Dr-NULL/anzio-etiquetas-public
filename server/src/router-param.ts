import { Endpoint } from './args/lib/endpoint';

import { DEPLOY_SERVER } from './args/server';
import { LOAD_SEEDS } from './args/seeds';
import { TEST } from './args/test';

export const ROUTES: Endpoint[] = [
  DEPLOY_SERVER,
  LOAD_SEEDS,
  TEST
]