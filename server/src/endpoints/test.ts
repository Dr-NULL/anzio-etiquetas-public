import { EndPoint } from '../tool/end-point';
import { Usuario } from '../models/usuario';
import { Menu } from '../models/menu';

export const TEST = new EndPoint()
TEST.method = 'get'
TEST.path = 'test'
TEST.callback = async (req, res) => {
  // Filter elements
  const session = req.session.current
  let menu: Menu[]

  // Search Menues
  if (session) {
    const data: Usuario = session.getData()
    menu = await Menu.getByType(
      data.usuarioTipo
    )
  } else {
    menu = await Menu.getByType()
  }

  // Only Visibles
  const check = (menu: Menu) => {
    if (menu.children.length > 0) {
      menu.children = menu.children.filter(check)
    }
    return !menu.hidden
  }

  res.apiRest.send(menu.filter(check))
}