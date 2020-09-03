import { UsuarioTipo } from '../models/usuario-tipo';
import { Menu } from '../models/menu';

export async function loadMenu() {
  const typeSys = await UsuarioTipo.findOne({ nombre: 'System' })
  const typeAdm = await UsuarioTipo.findOne({ nombre: 'Administrador' })

  let userForm = new Menu()
  userForm.everyone = true
  userForm.hidden = true
  userForm.icon = '<i class="fas fa-crown"></i>'
  userForm.text = 'Crear Super Usuario'
  userForm.path = '/usuario/system'
  await userForm.saveForTypes()
  
  userForm = new Menu()
  userForm.everyone = true
  userForm.hidden = true
  userForm.icon = '<i class="fas fa-crown"></i>'
  userForm.text = 'Configurar Usuario'
  userForm.path = '/usuario/add/:token'
  await userForm.saveForTypes()

  const home = new Menu()
  home.everyone = true
  home.hidden = true
  home.icon = '<i class="fas fa-home"></i>'
  home.text = 'Inicio'
  home.path = '/home'
  await home.saveForTypes()

  const crud = new Menu()
  crud.icon = '<i class="fas fa-cubes"></i>'
  crud.text = 'Mantenedores'
  await crud.saveForTypes()

  const crudUser = new Menu()
  crudUser.icon = '<i class="fas fa-user-cog"></i>'
  crudUser.text = 'Usuarios'
  crudUser.path = 'usuario/crud'
  crudUser.parent = crud
  await crudUser.saveForTypes(typeSys, typeAdm)

  const crudForm = new Menu()
  crudForm.icon = '<i class="fas fa-barcode"></i>'
  crudForm.text = 'Formatos'
  crudForm.path = '/formato/crud'
  crudForm.parent = crud
  await crudForm.saveForTypes()

  const crudFormEdit = new Menu()
  crudFormEdit.icon = '<i class="far fa-edit"></i>'
  crudFormEdit.hidden = true
  crudFormEdit.text = 'Editar Formato'
  crudFormEdit.path = '/formato/edit/:cod'
  crudFormEdit.parent = crud
  await crudFormEdit.saveForTypes()

  const crudProd = new Menu()
  crudProd.icon = '<i class="fas fa-truck-loading"></i>'
  crudProd.text = 'Productos'
  crudProd.path = '/producto/crud'
  crudProd.parent = crud
  await crudProd.saveForTypes()

  const login = new Menu()
  login.everyone = true
  login.hideOnLogged = true
  login.icon = '<i class="fas fa-sign-in-alt"></i>'
  login.text = 'Iniciar Sesión'
  login.path = '/usuario/login'
  await login.saveForTypes()

  const logout = new Menu()
  logout.icon = '<i class="fas fa-sign-out-alt"></i>'
  logout.text = 'Cerrar Sesión'
  await logout.saveForTypes()
}