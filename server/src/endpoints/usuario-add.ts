import { EndPoint } from '../tool/end-point';
import { Usuario } from '../models/usuario';
import { UsuarioQueue } from '../models/usuario-queue';
import { UsuarioTipo } from '../models/usuario-tipo';
import { Rut } from '../tool/rut';

import { checker } from '../tool/checker';
import { AES } from '../app';

export const USUARIO_ADD = new EndPoint()
USUARIO_ADD.method = 'put'
USUARIO_ADD.path = 'usuario/add/'
USUARIO_ADD.callback = async (req, res) => {
  // Token no válido
  const body: Usuario & Body = req.body
  if (checker(body.token) !== 'String') {
    res.apiRest.fail(
      400,
      'Formato del token inválido.'
    )
    return;
  }

  // Validar Token
  body.token = body.token.trim()
  if (body.token.length !== 128) {
    res.apiRest.fail(
      400,
      'El enlace solicitado no es válido.'
    )
    return
  }

  // Buscar dentro de la lista de pendientes
  const queue = await UsuarioQueue.findOne({ token: body.token })
  if (!queue) {
    res.apiRest.fail(
      404,
      'El enlace solicitado ha expirado.'
    )
    return
  }

  // Trimear Todo
  for (const key of Object.keys(body)) {
    if (checker(body[key]) === 'String') {
      body[key] = (body[key] as string).trim()
    }
  }

  // Validar Data de Entrada
  const msg = 'Los datos entregados no cumplen los criterios solicitados.'
  if (
    (checker(body.rut) !== 'String') ||
    (checker(body.nombres) !== 'String') ||
    (checker(body.apellidoP) !== 'String') ||
    (checker(body.pass) !== 'String')
  ) {
    res.apiRest.fail(400, msg)
    return
  } else if (
    (body.rut.length === 0) ||
    (!Rut.isValid(body.rut)) ||
    (body.nombres.length === 0) ||
    (body.apellidoP.length === 0) ||
    (body.pass.length < 8)
  ) {
    res.apiRest.fail(400, msg)
    return
  }

  // Buscar RUT coincidente
  let user = await Usuario.findOne({ rut: body.rut })
  if (user) {
    res.apiRest.fail(
      409,
      'El RUT ingresado ya está registrado en el sistema. '
      + 'Ingrese otro rut en el campo correspondiente.'
    )
    return
  }

  // Crear Usuario
  user = new Usuario()
  user.user = queue.user.trim()
  user.pass = AES.encrypt(body.pass)
  user.usuarioTipo = queue.usuarioTipo
  user.mail = queue.mail

  user.rut = Rut.format(body.rut)
  user.nombres = body.nombres.trim()
  user.apellidoP = body.apellidoP.trim()
  if (checker(body.apellidoM) === 'String') {
    user.apellidoM = body.apellidoM.trim()
  }

  await user.save()
  await queue.remove()
  res.apiRest.send()
}

interface Body {
  [key: string]: string | number;
  token?: string;
  id?: number;
  usuarioTipoId?: number;

  user: string;
  pass: string;
  nombres: string;
  apellidoP: string;
  apellidoM: string;
}