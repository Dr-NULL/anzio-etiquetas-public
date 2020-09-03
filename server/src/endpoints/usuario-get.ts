import { EndPoint } from '../tool/end-point';
import { Usuario } from '../models/usuario';
import { Menu } from '../models/menu';
import { UsuarioTipo } from '../models/usuario-tipo';
import { ValidateRequest } from '../tool/validate-request';

export const USUARIO_GET = new EndPoint()
USUARIO_GET.method = 'get'
USUARIO_GET.path = 'usuario/get/:id?'
USUARIO_GET.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  const self: Usuario = req.session.current.getData()
  const user = await Usuario.findOne({ id: self.id })
  const query: Query[] = await Usuario
    .createQueryBuilder('Username')
    .innerJoinAndSelect(
      'Username.usuarioTipo',
      'Type',
      ':rango < Type.rango',
      { rango: user.usuarioTipo.rango }
    )
    .select([
      'Username.id as id',
      'Username.rut as rut',
      'Username.nombres as nombres',
      'Username.apellidoP as apellidoP',
      'Username.apellidoM as apellidoM',
      'Username.user as [user]',
      'Username.mail as mail',
      'Username.isActive as isActive',
      'Type.id',
      'Type.rango',
      'Type.nombre',
      'Type.descripc'
    ])
    .execute()

  for (const user of query) {
    user.usuarioTipo = new UsuarioTipo()
    user.usuarioTipo.id = user.Type_id
    user.usuarioTipo.rango = user.Type_rango
    user.usuarioTipo.nombre = user.Type_nombre
    user.usuarioTipo.descripc = user.Type_descripc
    
    delete user.Type_id
    delete user.Type_rango
    delete user.Type_nombre
    delete user.Type_descripc
  }

  res.apiRest.send(query)
}

interface Query extends Usuario {
  usuarioTipo: UsuarioTipo;
  Type_id?: number;
  Type_rango?: number;
  Type_nombre?: string;
  Type_descripc?: string;
}