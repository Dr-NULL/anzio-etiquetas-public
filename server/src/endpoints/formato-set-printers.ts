import { EndPoint } from '../tool/end-point';
import { Formato } from '../models/formato';
import { Printer } from '../models/printer';

import { checker } from '../tool/checker';
import { ValidateRequest } from '../tool/validate-request';

export const FORMATO_SET_PRINTERS = new EndPoint()
FORMATO_SET_PRINTERS.method = 'post'
FORMATO_SET_PRINTERS.path = 'formato/set/:id/printers'
FORMATO_SET_PRINTERS.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  // Comprobar integridad de la URL
  const ID: number = parseInt(req.params.id)
  if (isNaN(ID)) {
    res.apiRest.fail(
      400,
      'El id ingresado en la URL no es formato numérico.'
    )
    return
  }

  // Comprobar integridad de los datos de entrada
  const INPUT: Printer[] = req.body  
  if (checker(INPUT) != 'Array') {
    res.apiRest.fail(
      400,
      'Los datos entregados en el body no corresponden a un Array.'
    )
    return
  }

  // Comprobar los registros individualmente
  for (const ITEM of INPUT) {
    if (checker(ITEM.name) != 'String') {
      res.apiRest.fail(
        400,
        'Los datos dentro del Array no contienen todos los parámetros requeridos.'
      )
      return
    }
  }

  // Buscar formato a editar
  const FORM = await Formato.findOne({ id: ID })
  if (FORM == null) {
    res.apiRest.fail(
      404,
      `El formato con id "${ID}" no existe.`
    )
    return
  }
  
  // Establecer elementos a agregar
  const TOADD: Printer[] = []
  for (const ITEM of INPUT) {
    const INNER = FORM
      .printers
      .find(x => 
        (x.name == ITEM.name)
      )

    if (INNER == null) {
      TOADD.push(ITEM)
    }
  }

  // Establecer elementos a remover
  const TOREM: Printer[] = []
  for (const ITEM of FORM.printers) {
    const INNER = INPUT
      .find(x => 
        (x.name == ITEM.name)
      )

    if (INNER == null) {
      TOREM.push(ITEM)
    }
  }

  // Agregar elementos nuevos
  for (const ITEM of TOADD) {
    if (TOREM.length > 0) {
      TOREM[0].name = ITEM.name
      
      await TOREM[0].save()
      TOREM.shift()
    } else {
      const CREATE = new Printer()
      CREATE.name = ITEM.name
      CREATE.formato = FORM
      await CREATE.save()
    }
  }

  // Quitar todo lo que sobre
  for (const ITEM of TOREM) {
    await ITEM.remove()
  }

  res.apiRest.send()
}
