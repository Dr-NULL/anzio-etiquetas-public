import { EndPoint } from '../tool/end-point';
import { ValidateRequest } from '../tool/validate-request';
import { Usuario } from '../models/usuario';

export const USUARIO_DISABLE = new EndPoint()
USUARIO_DISABLE.method = 'delete'
USUARIO_DISABLE.path = 'usuario/disable/:id?'
USUARIO_DISABLE.callback = async (req, res) => {
  // Validate request
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  // Validate id
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    res.apiRest.fail(
      400,
      'Para eliminar un elemento se debe de indicar un id del tipo numérico.'
    )
    return
  }

  // Search user
  const self: Usuario = req.session.current.getData()
  const user = await Usuario.findOne({ id })
  if (!user) {
    res.apiRest.fail(
      404,
      'El usuario con la id indicada no existe.'
    )
    return
  }

  // Validate hierarchy
  if (user.usuarioTipo.rango <= self.usuarioTipo.rango) {
    res.apiRest.fail(
      403,
        'No tiene los permisos suficientes para eliminar a un usuario '
      + `de rango "${self.usuarioTipo.nombre}" o superior.`
    )
    return
  }

  // Change status
  user.isActive = false
  await user.save()
  res.apiRest.send()
}
