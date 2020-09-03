import { getAppConfig } from './tool/app-config';
import { getOrmConfig } from './tool/orm-config';
import { Log } from './tool/log';


console.clear()
export const APP_CONFIG = getAppConfig()
export const ORM_CONFIG = getOrmConfig()

// Check Configuration Files
if (
  (APP_CONFIG == null) ||
  (ORM_CONFIG == null)
) {
  Log.ln()
  Log.ln('Se crearán los archivos faltantes. Establezca los')
  Log.ln('valores requeridos y vuelva a iniciar la API.\n')
  process.exit()
}

// Read Arguments
const ARGS = process.argv
ARGS.shift()
ARGS.shift()
while (ARGS.length <= 0) { ARGS.push('') }

// Initialize Application
import { Endpoint } from './args/lib/endpoint';
import { ROUTES } from './router-param';

Endpoint.router(ROUTES)