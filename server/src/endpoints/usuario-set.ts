import { ValidateRequest } from '../tool/validate-request';
import { EndPoint } from '../tool/end-point';
import { Usuario } from '../models/usuario';
import { Mail } from '../tool/mail';
import { UsuarioTipo } from '../models/usuario-tipo';

export const USUARIO_SET = new EndPoint()
USUARIO_SET.method = 'patch'
USUARIO_SET.path = 'usuario/set'
USUARIO_SET.callback = async (req, res) => {
  const test = new ValidateRequest(req, res)
  test.keys = [
    { key: 'id',        type: 'Number' },
    { key: 'mail',      type: 'String', length: 4 },
    { key: 'user',      type: 'String', length: 4 },
    { key: 'rut',       type: 'String', length: 5 },
    { key: 'nombres',   type: 'String', length: 1 },
    { key: 'apellidoP', type: 'String', length: 1 },
    { key: 'apellidoM', type: 'String', length: 0 }
  ]

  if (
    (!test.checkSession()) ||
    (!await test.checkPath()) ||
    (!test.checkBody())
  ) {
    return
  }

  // Check type
  const body: Usuario = req.body
  const self: Usuario = req.session.current.getData()
  const type = await UsuarioTipo.findOne({ id: body.usuarioTipo.id })
  if (!type) {
    res.apiRest.fail(
      404,
      'El tipo de usuario indicado no existe.'
    )
    return
  } else if (type.rango <= self.usuarioTipo.rango) {
    res.apiRest.fail(
      403,
      'No puede asignar un tipo de usuario igual o superior al suyo.'
    )
    return
  }

  // Check Email
  if (!Mail.isValid(body.mail)) {
    res.apiRest.fail(400, test.msgBadReq)
    return
  }

  // Find User
  const user = await Usuario.findOne({ id: body.id })
  if (!user) {
    res.apiRest.fail(
      404,
      'El usuario indicado no existe.'
    )
    return
  }

  // Edit data
  user.mail = body.mail
  user.user = body.user
  user.rut = body.rut
  user.nombres = body.nombres
  user.apellidoP = body.apellidoP
  user.apellidoM = body.apellidoM
  user.usuarioTipo = type
  await user.save()
  res.apiRest.send()
}
