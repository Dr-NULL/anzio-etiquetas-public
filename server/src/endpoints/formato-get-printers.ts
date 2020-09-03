import { EndPoint } from '../tool/end-point';
import { Formato } from '../models/formato';
import { Printer } from '../models/printer';
import { checker } from '../tool/checker';
import { ValidateRequest } from '../tool/validate-request';

export const FORMATO_GET_PRINTERS = new EndPoint()
FORMATO_GET_PRINTERS.method = 'get'
FORMATO_GET_PRINTERS.path = 'formato/get/:id/printers'
FORMATO_GET_PRINTERS.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  const ID = parseInt(req.params.id, 10)
  if (isNaN(ID)) {
    res.apiRest.fail(400, 'La id suministrada solo debe de tener caracteres numéricos.')
    return
  }
  
  const PRINTERS: Printer[] = await Printer.find({
    relations: [],
    where: {
      formato: ID
    }
  })

  res.apiRest.send(PRINTERS)
}
