import { EndPoint } from '../tool/end-point';
import { checker } from '../tool/checker';
import { Language } from '../models/language';
import { Like, Not } from 'typeorm';
import { ValidateRequest } from '../tool/validate-request';

export const LANGUAGE_SET = new EndPoint()
LANGUAGE_SET.method = 'post'
LANGUAGE_SET.path = 'language/set'
LANGUAGE_SET.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  validate.keys = [
    { key: 'id',        type: 'Number' },
    { key: 'codigo',    type: 'String' },
    { key: 'descripc',  type: 'String' }
  ]
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath()) ||
    (!validate.checkBody())
  ) {
    return
  }

  const data: Language = req.body
  if (
    (checker(data.id) != 'Number') ||
    (checker(data.codigo) != 'String') ||
    (checker(data.descripc) != 'String')
  ) {
    res.apiRest.fail(
      400,
      'El objeto que ha enviado no contiene todos los campos requeridos.'
    )
    return
  }

  // Validación de Largo de caracteres
  data.codigo = data.codigo.trim()
  data.descripc = data.descripc.trim()
  if (
    (data.codigo.length == 0) ||
    (data.descripc.length == 0)
  ) {
    res.apiRest.fail(
      400,
        'No se puede modificar un reguistro enviando un campo de largo 0 (se han '
      + 'eliminado los espacios del inicio y del final).'
    )
    return
  }

  // Validación de registro
  const obj = await Language.findOne({ id: data.id })
  if (obj == null) {
    res.apiRest.fail(
      404,
      'Registro a editar no encontrado.'
    )
    return
  } else if (obj.default) {
    res.apiRest.fail(
      423,
        'El reguistro que se desea modificar es un registro por defecto, por lo cual '
      + 'está bloqueado.'
    )
    return
  }

  // Validación de Duplicado
  let count = 0
  count += await Language.count({ codigo: Like(data.codigo), id: Not(obj.id) })
  count += await Language.count({ descripc: Like(data.descripc), id: Not(obj.id) })
  if (count > 0) {
    res.apiRest.fail(
      400,
      'Uno de los campos que está ingresando está duplicado.'
    )
    return
  }

  obj.codigo = data.codigo
  obj.descripc = data.descripc
  
  await obj.save()
  res.apiRest.send(obj)
}
