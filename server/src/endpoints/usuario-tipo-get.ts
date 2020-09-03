import { EndPoint } from '../tool/end-point';
import { UsuarioTipo } from '../models/usuario-tipo';
import { Usuario } from '../models/usuario';
import { ValidateRequest } from '../tool/validate-request';

export const USUARIO_TIPO_GET = new EndPoint()
USUARIO_TIPO_GET.method = 'get'
USUARIO_TIPO_GET.path = 'usuario-tipo/get'
USUARIO_TIPO_GET.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  const curr: Usuario = req.session.current.getData()
  const user: Usuario = await Usuario.findOne({ id: curr.id })
  const types = await UsuarioTipo
    .createQueryBuilder('Type')
    .select([ '*' ])
    .where(
      ':rango < Type.rango',
      { rango: curr.usuarioTipo.rango }
    )
    .execute()

  res.apiRest.send(types)
}
