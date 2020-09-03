import { EndPoint } from '../tool/end-point';

export const USUARIO_LOGOUT = new EndPoint()
USUARIO_LOGOUT.method = 'get'
USUARIO_LOGOUT.path = 'usuario/logout'
USUARIO_LOGOUT.callback = (req, res) => {
  req.session.delete()
  res.apiRest.send()
}
