import { EndPoint } from '../tool/end-point';
import { Language } from '../models/language';
import { ValidateRequest } from '../tool/validate-request';

export const LANGUAGE_GET = new EndPoint()
LANGUAGE_GET.method = 'get'
LANGUAGE_GET.path = 'language/get'
LANGUAGE_GET.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  // Search Data
  const data = await Language.find(
    {
      order: {
        default: 'DESC',
        codigo: 'ASC'
      }
    }
  )

  res.apiRest.send(data)
}
