import { EndPoint } from '../tool/end-point';
import { Usuario } from '../models/usuario';
import { Menu } from '../models/menu';
import { UsuarioTipo } from '../models/usuario-tipo';

export const USUARIO_GET_SESSION = new EndPoint()
USUARIO_GET_SESSION.method = 'get'
USUARIO_GET_SESSION.path = 'usuario/get/session'
USUARIO_GET_SESSION.callback = async (req, res) => {
  // Get menu list
  const session = req.session.current
  let user: Usuario;
  let menu: Menu[];

  if (session) {
    user = session.getData()
    user = await Usuario.findOne({ id: user.id })
    menu = await Menu.getByType(user.usuarioTipo)
  } else {
    menu = await Menu.getByType()
  }

  // Filter items
  const check = (menu: Menu) => {
    if (menu.children.length > 0) {
      menu.children = menu.children.filter(check)
    }
    return (
      (user) &&
      (!menu.hideOnLogged)
    ) || (
      (!user)
    )
  }
  
  menu = menu.filter(check)
  const body: CheckSession = { user, menu }
  res.apiRest.send(body)
}

export interface CheckSession {
  user: Usuario;
  menu: Menu[];
}