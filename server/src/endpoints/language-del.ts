import { EndPoint } from '../tool/end-point';
import { Language } from '../models/language';
import { ProductoDet } from '../models/producto-det';
import { ValidateRequest } from '../tool/validate-request';

export const LANGUAGE_DEL = new EndPoint()
LANGUAGE_DEL.method = 'get'
LANGUAGE_DEL.path = 'language/del/:id'
LANGUAGE_DEL.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }
  
  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) {
    res.apiRest.fail(
      400,
      'El id entregado no es un valor numérico. Por favor envíe solo ids del tipo numérico.'
    )
    return
  }

  const lang = await Language.findOne({ id })
  if (lang == null) {
    res.apiRest.fail(
      404,
      'No se ha encontrado ningún registro con el id indicado.'
    )
    return
  } else if (lang.default) {
    res.apiRest.fail(
      423,
      'No está permitido quitar un elemento que esté establecido por defecto.'
    )
    return
  }

  // Borrar registros
  const details = await ProductoDet.find({ language: lang })
  for (let item of details) {
    await item.remove()
  }
  
  await lang.remove()
  res.apiRest.send()
}
