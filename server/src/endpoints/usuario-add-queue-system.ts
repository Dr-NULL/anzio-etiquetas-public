import { EndPoint } from '../tool/end-point';
import { generateName } from '../tool/name-gen';
import { HtmlParser } from '../tool/html-parser';
import { Mail } from '../tool/mail';
import { checker } from '../tool/checker';
import { join } from 'path';

import { APP_CONFIG } from '..';
import { Usuario } from '../models/usuario';
import { UsuarioTipo } from '../models/usuario-tipo';
import { UsuarioQueue } from '../models/usuario-queue';
import { Like } from 'typeorm';

export const USUARIO_ADD_QUEUE_SYSTEM = new EndPoint()
USUARIO_ADD_QUEUE_SYSTEM.method = 'post'
USUARIO_ADD_QUEUE_SYSTEM.path = 'usuario/add/queue/system'
USUARIO_ADD_QUEUE_SYSTEM.callback = async (req, res) => {
  // Verificar Body
  const body: Body = req.body
  if (
    (checker(body.user) !== 'String') ||
    (checker(body.mail) !== 'String')
  ) {
    res.apiRest.fail(
      400,
      'El cuerpo de la solicitud no tiene la estructura correcta.'
    )
    return
  } else if(
    (body.user.trim().length < 4) ||
    (body.mail.trim().length < 10)
  ) {
    res.apiRest.fail(
      400,
      'El cuerpo de la solicitud contiene valores de un largo menor al requerido (user = 4, email = 10).'
    )
    return
  }

  // Comprobar existencia de Usuario
  const type = await UsuarioTipo.findOne({ nombre: Like('system') })
  let user = await Usuario.findOne({ usuarioTipo: type })

  // Comprobar que no exista el usuario System
  if (user) {
    res.apiRest.fail(
      403,
        'No está permitido crear un nuevo usuario System cuando ya existe '
      + 'dicho usuario en el sistema.'
    )
    return
  }

  // Buscar coincidencias
  body.user = body.user.trim()
  body.mail = body.mail.trim()
  user = await Usuario.findOne({
    where: [
      { user: body.user },
      { mail: body.mail }
    ]
  })
  if (user) {
    res.apiRest.fail(
      403,
        'No está permitido crear un nuevo usuario con un username o un '
      + 'email ya registrado en el sistema.'
    )
    return
  }
  
  // Crear nuevo Token
  let queueList = await UsuarioQueue.find({
    where: [
      { user: Like(body.user) },
      { mail: Like(body.mail) }
    ]
  })

  let queue: UsuarioQueue;
  if (queueList.length >= 1) {
    queue = queueList.shift()
    for (const item of queueList) {
      await item.remove()
    }
  } else {
    queue = new UsuarioQueue()
  }
  
  queue.token = generateName(null, 128 - 17)
  queue.user = body.user
  queue.mail = body.mail
  queue.usuarioTipo = type
  await queue.save()

  // Enviar HTML
  const mail = new Mail(APP_CONFIG.mail)
  const html = HtmlParser.fromHtmlFile(
    join(APP_CONFIG.folder.html, 'create-user-system.html'),
    { link:
          req.protocol + '://'
        + req.hostname + '/usuario/add/'
        + queue.token
    }
  )

  mail.to.push(queue.mail)
  mail.subject = 'Registro Usuario System'
  await mail.sendHtml(html.build())
  res.apiRest.send()
} 

interface Body {
  user: string;
  mail: string;
}