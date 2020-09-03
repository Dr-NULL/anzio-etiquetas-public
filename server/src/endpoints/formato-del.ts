import { EndPoint } from '../tool/end-point';
import { Formato } from '../models/formato';
import { FormatoConfig } from '../models/formato-config';
import { ValidateRequest } from '../tool/validate-request';

export const FORMATO_DEL = new EndPoint()
FORMATO_DEL.method = 'delete'
FORMATO_DEL.path = 'formato/del/:id'
FORMATO_DEL.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    res.apiRest.fail(
      400,
      'El id indicado es inválido, solo se permiten ids del tipo numérico.'
    )
    return
  }

  const main = await Formato.findOne({ id })
  if (!main) {
    res.apiRest.fail(
      404,
      'El recurso que se desea eliminar no existe.'
    )
  } else {
    // Remove Children
    for (const item of main.formatoText) {
      await item.remove()
    }

    for (const item of main.formatoRect) {
      await item.remove()
    }

    for (const item of main.formatoPict) {
      await item.remove()
    }

    for (const item of main.printers) {
      await item.remove()
    }

    // Remover configuración
    const conf = await FormatoConfig.find({
      select: [ 'id' ],
      where: {
        formato: main
      }
    })
    for (const item of conf) {
      await item.remove()
    }

    // Remover Elemento
    await main.remove()
    res.apiRest.send()
  }
}
