import { EndPoint } from '../tool/end-point';
import { UsuarioQueue } from '../models/usuario-queue';

import { checker } from '../tool/checker';
import { Usuario } from '../models/usuario';
import { UsuarioTipo } from '../models/usuario-tipo';
import { Menu } from '../models/menu';
import { ValidateRequest } from '../tool/validate-request';

export const USUARIO_GET_QUEUE = new EndPoint()
USUARIO_GET_QUEUE.method = 'get'
USUARIO_GET_QUEUE.path = 'usuario/get/queue/:token?'
USUARIO_GET_QUEUE.callback = async (req, res) => {
  const token: string = req.params.token
  if (checker(token) === 'String') {
    if (token.length === 0) {
      // Token inválido
      res.apiRest.fail(
        400,
        'No se puede entregar como token una cadena vacía.'
      ) 
    } else {
      // Buscar queue
      const queue = await UsuarioQueue.findOne({ token })
      if (!queue) {
        res.apiRest.fail(
          404,
          'No se ha encontrado la solicitud asociada a dicho token.'
        )
      } else {
        res.apiRest.send(queue)
      }
    }
    
  } else {
    const validate = new ValidateRequest(req, res)
    if (
      (!validate.checkSession()) ||
      (!await validate.checkPath())
    ) {
      return
    }

    // Buscar Lista
    const curr: Usuario = req.session.current.getData()
    const self = await Usuario.findOne({ id: curr.id })
    const queue: Queue[] = await UsuarioQueue
      .createQueryBuilder('Queue')
      .innerJoinAndSelect(
        'Queue.creator',
        'User'
      )
      .innerJoinAndSelect(
        'User.usuarioTipo',
        'UserType',
        'UserType.rango >= :rango',
        { rango: self.usuarioTipo.rango }
      )
      .innerJoinAndSelect(
        'Queue.usuarioTipo',
        'Type'
      )
      .select([
        'Queue.*',
        'User.id as User_id',
        'User.rut as User_rut',
        'User.nombres as User_nombres',
        'User.apellidoP as User_apellidoP',
        'User.apellidoM as User_apellidoM',
        'User.user as User_user',
        'User.mail as User_mail',
        'User.isActive as User_isActive',
        'UserType.id as UserType_id',
        'UserType.rango as UserType_rango',
        'UserType.nombre as UserType_nombre',
        'UserType.descripc as UserType_descripc',
        'Type.id as Type_id',
        'Type.rango as Type_rango',
        'Type.nombre as Type_nombre',
        'Type.descripc as Type_descripc'
      ])
      .execute()

    // Reestructurar lista
    for (const item of queue) {
      delete item.usuarioId
      delete item.usuarioTipoId

      item.creator = new Usuario()
      item.creator.id = item.User_id
      item.creator.rut = item.User_rut
      item.creator.nombres = item.User_nombres
      item.creator.apellidoP = item.User_apellidoP
      item.creator.apellidoM = item.User_apellidoM
      item.creator.user = item.User_user
      item.creator.mail = item.User_mail
      item.creator.isActive = item.User_isActive

      delete item.User_id
      delete item.User_rut
      delete item.User_nombres
      delete item.User_apellidoP
      delete item.User_apellidoM
      delete item.User_user
      delete item.User_mail
      delete item.User_isActive

      item.creator.usuarioTipo = new UsuarioTipo()
      item.creator.usuarioTipo.id = item.UserType_id
      item.creator.usuarioTipo.rango = item.UserType_rango
      item.creator.usuarioTipo.nombre = item.UserType_nombre
      item.creator.usuarioTipo.descripc = item.UserType_descripc

      delete item.UserType_id
      delete item.UserType_rango
      delete item.UserType_nombre
      delete item.UserType_descripc

      item.usuarioTipo = new UsuarioTipo()
      item.usuarioTipo.id = item.Type_id
      item.usuarioTipo.rango = item.Type_rango
      item.usuarioTipo.nombre = item.Type_nombre
      item.usuarioTipo.descripc = item.Type_descripc

      delete item.Type_id
      delete item.Type_rango
      delete item.Type_nombre
      delete item.Type_descripc
    }

    res.apiRest.send(queue)
  }
}

interface Queue extends UsuarioQueue {
  usuarioTipoId?: number;
  usuarioId?: number;
  
  // Campos Usuario
  User_id?: number;
  User_rut?: string;
  User_nombres?: string;
  User_apellidoP?: string;
  User_apellidoM?: string;
  User_user?: string;
  User_mail?: string;
  User_isActive?: boolean;

  // Campos UsuarioTipo
  Type_id?: number;
  Type_rango?: number;
  Type_nombre?: string;
  Type_descripc?: string;
  UserType_id?: number;
  UserType_rango?: number;
  UserType_nombre?: string;
  UserType_descripc?: string;
}