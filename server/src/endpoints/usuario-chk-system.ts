import { UsuarioTipo } from '../models/usuario-tipo';
import { EndPoint } from '../tool/end-point';
import { Like } from 'typeorm';
import { Usuario } from '../models/usuario';
import { UsuarioQueue } from '../models/usuario-queue';

export const USUARIO_CHK_SYSTEM = new EndPoint()
USUARIO_CHK_SYSTEM.method = 'get'
USUARIO_CHK_SYSTEM.path = 'usuario/chk/system'
USUARIO_CHK_SYSTEM.callback = async (req, res) => {
  const type = await UsuarioTipo.findOne({ nombre: Like('system') })
  const user = await Usuario.find({ usuarioTipo: type })
  const list = await UsuarioQueue.find({ 
    usuarioTipo: type
  })

  res.apiRest.send({
    exists:
      (user.length > 0) ||
      (list.length > 0)
  })
}
