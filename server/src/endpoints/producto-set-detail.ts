import { EndPoint } from '../tool/end-point';
import { checker } from '../tool/checker';

import { Producto } from '../models/producto';
import { Language } from '../models/language';
import { ProductoDet } from '../models/producto-det';
import { ValidateRequest } from '../tool/validate-request';

export const PRODUCTO_SET_DETAIL = new EndPoint()
PRODUCTO_SET_DETAIL.method = 'put'
PRODUCTO_SET_DETAIL.path = 'producto/set/:id/detail'
PRODUCTO_SET_DETAIL.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  // Parsear ID
  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) {
    res.apiRest.fail(
      400,
      'Solo se aceptan id del tipo numérico.'
    )
    return
  }

  // Buscar producto de Origen
  const prod = await Producto.findOne({
    select: [ 'id', 'codigo' ],
    relations: [ 'productoDet' ],
    where: { id }
  })
  if (!prod) {
    res.apiRest.fail(
      404,
      'El producto con la id especificada no existe.'
    )
    return
  }

  // Validar Array
  const body: Detail[] = req.body
  if (checker(body) !== 'Array') {
    res.apiRest.fail(
      400,
      'Solo se permite entregar datos dentro en un Array.'
    )
    return
  }
  for (const item of body) {
    if (
      (checker(item.descripc) !== 'String') ||
      (checker(item.langId) !== 'Number')
    ) {
      res.apiRest.fail(
        400,
        'Los elementos dentro del Array no tienen una estructura válida.'
      )
      return
    }
  }

  // Elementos a Agregar
  for (const item of body) {
    let found = prod
      .productoDet
      .find(x => x.language.id === item.langId)

    if (!found) {
      found = new ProductoDet()
      found.producto = prod
      found.language = await Language.findOne({
        id: item.langId
      })
    } else if (found.language.default) {
      continue
    }
    
    found.descripc = item.descripc.trim()
    await found.save()
  }

  // Elementos a Quitar
  for (const item of prod.productoDet) {
    let found = body.find(x => x.langId === item.language.id)
    if (!found && !item.language.default) {
      await item.remove()
    }
  }

  res.apiRest.send()
}

interface Detail {
  descripc: string;
  langId: number;
}