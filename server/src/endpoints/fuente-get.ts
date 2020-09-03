import { EndPoint } from '../tool/end-point';
import { Fuente } from '../models/fuente';
import { ValidateRequest } from '../tool/validate-request';

export const FUENTE_GET = new EndPoint()
FUENTE_GET.method = 'get'
FUENTE_GET.path = 'fuente/get'
FUENTE_GET.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  const data = await Fuente.find()
  res.apiRest.send(data.map(
    x => {
      delete x.filename
      return x
    }
  ))
}