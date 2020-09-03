import { EndPoint } from '../tool/end-point';
import { Pais } from '../models/pais';
import { ValidateRequest } from '../tool/validate-request';

export const PAIS_GET = new EndPoint()
PAIS_GET.method = 'get'
PAIS_GET.path = 'pais/get'
PAIS_GET.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  const DATA = await Pais.find({ isActive: true })
  res.apiRest.send(DATA)
}
