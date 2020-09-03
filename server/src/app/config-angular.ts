import Express from 'express';
import { APP_CONFIG } from '..';
import { APP } from '.';

import { Usuario } from '../models/usuario';
import { UsuarioTipo } from '../models/usuario-tipo';
import { Arguments } from '../args/lib/arguments';

const arg = new Arguments()
export function configAngular() {
  APP.use(Express.static(APP_CONFIG.folder.angular))
  APP.use(async (req, res, nxt) => {
    // Iniciar sesión para efectos de prueba
    if (
      (!req.session.current) &&
      (arg.find('system', 'sys'))
    ) {
      const type = await UsuarioTipo.findOne({ rango: 0 })
      const user = await Usuario.findOne({ usuarioTipo: type })

      req.session.create()
      req.session.current.setData(user)
    }
    
    // Devolver carpeta de estáticos al cliente
    if (!req.path.toLowerCase().startsWith('/api/')) {
      res.sendFile('index.html', {
        root: APP_CONFIG.folder.angular
      })
    } else {
      nxt()
    }
  })
}