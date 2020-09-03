import { AESCrypto } from '../tool/aes-crypto';
import { EndPoint } from '../tool/end-point';
import { Usuario } from '../models/usuario';
import { checker } from '../tool/checker';
import 'session-crossover';
import { ValidateRequest } from '../tool/validate-request';

export const USUARIO_LOGIN = new EndPoint()
USUARIO_LOGIN.method = 'post'
USUARIO_LOGIN.path = 'usuario/login'
USUARIO_LOGIN.callback = async (req, res) => {
  const validator = new ValidateRequest(req, res)
  validator.keys = [
    { key: 'user', type: 'String', length: 4 },
    { key: 'pass', type: 'String', length: 8 }
  ]
  if (!validator.checkBody()) {
    return
  }
  
  // Buscar usuario
  const body: Body = req.body
  const encr = AESCrypto.load()
  const user = await Usuario.findOne({
    user: body.user,
    pass: encr.encrypt(body.pass)
  })

  if (!user) {
    res.apiRest.fail(
      404,
        'El usuario o contraseña indicados son incorrectos. Por favor '
      + 'revise su usuario o contraseña y reinténtelo.'
    )
    return
  }

  if (req.session.current) {
    res.apiRest.fail(
      409,
      'Ya existe una sesión activa en su dispositivo. Pruebe primero '
      + 'con cerrar sesión antes de iniciar otra.'
      )
  } else {
    // Crear nueva sesión
    const data = {
      id: user.id,
      user: user.user,
      mail: user.mail,
      nombres: user.nombres,
      apellidoP: user.apellidoP,
      apellidoM: user.apellidoM,
      usuarioTipo: user.usuarioTipo
    }
    req.session.create()
    req.session.current.setData(data)
    res.apiRest.send(data)
  }
}

interface Body {
  user: string;
  pass: string;
}
