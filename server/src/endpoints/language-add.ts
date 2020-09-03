import { EndPoint } from '../tool/end-point';
import { checker } from '../tool/checker';
import { Like } from 'typeorm';
import { Language } from '../models/language';
import { ValidateRequest } from '../tool/validate-request';

export const LANGUAGE_ADD = new EndPoint()
LANGUAGE_ADD.method = 'post'
LANGUAGE_ADD.path = 'language/add'
LANGUAGE_ADD.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  validate.keys = [
    { key: 'id',        type: 'Null'   },
    { key: 'codigo',    type: 'String', length: 1 },
    { key: 'descripc',  type: 'String', length: 1 }
  ]
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath()) ||
    (!validate.checkBody())
  ) {
    return
  }

  const body: Language = req.body
  body.codigo = body.codigo.toUpperCase().trim()
  body.descripc = body.descripc.trim()
  if (
    (body.codigo.length == 0) ||
    (body.descripc.length == 0)
  ) {
    res.apiRest.fail(
      400,
      'No se puede agregar un registro teniendo campos (previamente trimeados) de largo 0.'
    )
    return
  }
  
  const repeat = await Language.find({ codigo: Like(body.codigo) })
  if (repeat.length > 0) {
    res.apiRest.fail(
      406,
      'No se puede guardar un nuevo registro que posea un código que ya esté registrado en la base de datos.'
    )
    return
  }

  const obj = new Language()
  obj.codigo = body.codigo
  obj.descripc = body.descripc
  await obj.save()
  res.apiRest.send(obj)
}
