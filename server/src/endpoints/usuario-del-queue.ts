import { EndPoint } from '../tool/end-point';
import { Menu } from '../models/menu';
import { Usuario } from '../models/usuario';
import { UsuarioQueue } from '../models/usuario-queue';
import { ValidateRequest } from '../tool/validate-request';

export const USUARIO_DEL_QUEUE = new EndPoint()
USUARIO_DEL_QUEUE.method = 'delete'
USUARIO_DEL_QUEUE.path = 'usuario/del/queue/:id'
USUARIO_DEL_QUEUE.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  // Comprobar jerarquía
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    res.apiRest.fail(
      400,
      'El formato del id entregado no es válido.'
    )
    return
  }

  const curr: Usuario = req.session.current.getData()
  const self = await Usuario.findOne({ id: curr.id })
  const queue = await UsuarioQueue.findOne({
    select: [
      'id',
      'createdAt',
      'user',
      'mail',
      'token'
    ],
    relations: [
      'creator',
      'usuarioTipo'
    ],
    where: { id }
  })

  if (!queue) {
    res.apiRest.fail(
      404,
      'El elemento a eliminar no existe.'
    )
    return
  } else if (queue.creator.usuarioTipo.rango < self.usuarioTipo.rango) {
    res.apiRest.fail(
      403,
        'No se puede eliminar un elemento que fué creado por un usuario '
      + 'de igual o mayor rango que el suyo.'
    )
    return
  }

  await queue.remove()
  res.apiRest.send()
}
