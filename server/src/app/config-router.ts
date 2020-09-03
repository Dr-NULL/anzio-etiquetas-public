import { Request, Response, NextFunction } from 'express';
import { APP_CONFIG } from '..';
import { ROUTES } from '../router-endpoint';
import { APP } from '.';
import { ApiRest } from '../tool/api-rest';
import { nextTick } from 'process';

export function configRouter() {
  for (let route of ROUTES) {
    route.path = '/' + APP_CONFIG.server.prefix + '/' + route.path.replace(/^(\/|\\)+/gi, '')
    route.path = route.path.replace(/^\/+/gi, '/')

    switch (route.method) {
      case "get":
        APP.get(route.path, wrapAsync(route.callback))
        break
      case "post":
        APP.post(route.path, wrapAsync(route.callback))
        break
      case "options":
        APP.options(route.path, wrapAsync(route.callback))
        break
      case "put":
        APP.put(route.path, wrapAsync(route.callback))
        break
      case "patch":
        APP.patch(route.path, wrapAsync(route.callback))
        break
      case "merge":
        APP.merge(route.path, wrapAsync(route.callback))
        break
      case "delete":
        APP.delete(route.path, wrapAsync(route.callback))
        break
    }
  }

  APP.all(APP_CONFIG.server.prefix + '/*', wrapAsync((req: Request, res: Response) => {
    res.statusCode = 404
    throw new Error('Contenido no encontrado.')
  }))

  APP.all('*', wrapAsync((req: Request, res: Response) => {
    res.statusCode = 404
    throw new Error('Página no encontrada.')
  }))
}

function wrapAsync(fn: any) {
  return function (req: Request, res: Response, nxt: NextFunction) {
    res.apiRest = new ApiRest(req, res)

    if (fn.constructor.name == 'AsyncFunction') {
      fn(req, res)
        .catch((err: any) => {
          nxt(err);
        })
    } else {
      try {
        fn(req, res)
      } catch (err) {
        nxt(err);
      }
    }
  }
}