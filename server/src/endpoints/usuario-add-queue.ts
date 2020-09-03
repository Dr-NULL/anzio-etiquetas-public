import { EndPoint } from '../tool/end-point';
import { checker } from '../tool/checker';

import { UsuarioQueue } from '../models/usuario-queue';
import { UsuarioTipo } from '../models/usuario-tipo';
import { Menu } from '../models/menu';
import { Usuario } from '../models/usuario';
import { Mail } from '../tool/mail';
import { APP_CONFIG } from '..';
import { HtmlParser } from '../tool/html-parser';
import { join } from 'path';
import { generateName } from '../tool/name-gen';
import { ValidateRequest } from '../tool/validate-request';

interface Body {
  user: string;
  mail: string;
  usuarioTipoId: number;
}

export const USUARIO_ADD_QUEUE = new EndPoint()
USUARIO_ADD_QUEUE.method = 'post'
USUARIO_ADD_QUEUE.path = 'usuario/add/queue'
USUARIO_ADD_QUEUE.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  validate.keys = [
    { key: 'user',          type: 'String', length: 4 },
    { key: 'mail',          type: 'String', length: 5 },
    { key: 'usuarioTipoId', type: 'Number' }
  ]
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath()) ||
    (!validate.checkBody())
  ) {
    return
  }
  
  const body: Body = req.body
  body.user = body.user.toLowerCase().trim()
  body.mail = body.mail.toLowerCase().trim()
  if (
    (body.user.length < 4) ||
    (!Mail.isValid(body.mail))
  ) {
    res.apiRest.fail(
      400,
        'El email ingresado no es válido.'
    )
    return
  }

  const curr: Usuario = req.session.current.getData()
  const self: Usuario = await Usuario.findOne({ id: curr.id })
  const type = await UsuarioTipo.findOne({ id: body.usuarioTipoId })
  if (!type) {
    res.apiRest.fail(
      404,
      'El tipo de usuario especificado no existe.'
    )
    return
  } else if (self.usuarioTipo.rango >= type.rango) {
    res.apiRest.fail(
      403,
        'No está permitido crear un usuario con un nivel '
      + 'de privilegios igual o superior al de la cuenta actual.'
    )
    return
  }

  const user = await Usuario.find({
    where: [
      { user: body.user, isActive: true },
      { mail: body.mail, isActive: true }
    ]
  })
  if (user.length > 0) {
    res.apiRest.fail(
      400,
        'No está permitido crear un usuario en donde el nick '
      + 'o el email ya se encuentra en registrado. Si realmente '
      + 'lo que busca es volver a crear el usuario, primero '
      + 'elimílelo antes de volverlo a crear.'
    )
    return
  }

  // Buscar Coincidencias
  const queues = await UsuarioQueue.find({
    where: [
      { user: body.user },
      { mail: body.mail }
    ]
  })

  // Filtrar Coincidencias
  let queue = queues.shift()
  for (const item of queues) {
    await item.remove()
  }

  // Nueva Queue
  if (!queue) {
    queue = new UsuarioQueue()
  }
  queue.user = body.user
  queue.mail = body.mail
  queue.usuarioTipo = type
  queue.creator = self
  queue.token = generateName(null, 128 - 17)
  await queue.save()

  // Enviar HTML
  const mail = new Mail(APP_CONFIG.mail)
  const html = HtmlParser.fromHtmlFile(
    join(APP_CONFIG.folder.html, 'create-user.html'),
    { link:
          req.protocol + '://'
        + req.hostname + '/usuario/add/'
        + queue.token,
      nombres: self.nombres,
      apellidos: (() => {
        if (self.apellidoM) {
          return `${self.apellidoP} ${self.apellidoM}`
        } else {
          return self.apellidoP
        }
      })()
    }
  )

  mail.to.push(queue.mail)
  mail.subject = 'Registro Usuario'
  await mail.sendHtml(html.build())
  res.apiRest.send()
}
