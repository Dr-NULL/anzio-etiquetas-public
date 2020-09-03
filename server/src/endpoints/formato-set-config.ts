import { EndPoint } from '../tool/end-point';
import { FormatoConfig } from '../models/formato-config';
import { Producto } from '../models/producto';
import { Pais } from '../models/pais';
import { checker } from '../tool/checker';
import { Formato } from '../models/formato';
import { ValidateRequest } from '../tool/validate-request';

interface IRawConfig {
  id: number;
  paisId: number;
  productoId: number;
}

export const FORMATO_SET_CONFIG = new EndPoint()
FORMATO_SET_CONFIG.method = 'post'
FORMATO_SET_CONFIG.path = 'formato/set/:id/config'
FORMATO_SET_CONFIG.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  const BODY: IRawConfig[] = req.body
  if (checker(BODY) != 'Array') {
    res.apiRest.fail(400, 'Data enviada con el formato incorrecto.')
    return
  }

  const ID = parseInt(req.params.id)
  if (isNaN(ID)) {
    res.apiRest.fail(400, 'El id ingresado no es de formato numérico.')
    return
  }

  const FORM = await Formato.findOne({
    select: [
      'id',
      'codigo',
      'descripc'
    ],
    where: {
      id: ID
    }
  })

  if (FORM == null) {
    res.apiRest.fail(404, `No se ha encontrado ningún formato con id "${ID}".`)
    return
  }

  const READR: IRawConfig[] = await FormatoConfig
    .createQueryBuilder()
    .select([
      'id',
      'paisId',
      'productoId'
    ])
    .where({
      formato: FORM.id
    })
    .execute()
  
  // Establecer qué elementos se agregarán
  const TOADD: IRawConfig[] = []
  for (const ITEM of BODY) {
    const INNER = READR
      .find(x => 
        (x.paisId == ITEM.paisId) &&
        (x.productoId == ITEM.productoId)
      )

    if (INNER == null) {
      TOADD.push(ITEM)
    }
  }

  // Establecer los elementos a quitar
  const TOREM: IRawConfig[] = []
  for (const ITEM of READR) {
    const INNER = BODY
      .find(x => 
        (x.paisId == ITEM.paisId) &&
        (x.productoId == ITEM.productoId)
      )

    if (INNER == null) {
      TOREM.push(ITEM)
    }
  }

  // Agregar nuevos elementos
  for (const ITEM of TOADD) {
    const PAIS = await Pais.findOne({ id: ITEM.paisId })
    const PROD = await Producto.findOne({
      select: [
        'id',
        'codigo'
      ],
      where: {
        id: ITEM.productoId
      }
    })

    let conf: FormatoConfig
    if (TOREM.length > 0) {
      conf = await FormatoConfig.findOne({
        select: [ 'id' ],
        where: { id: TOREM[0].id }
      })
      TOREM.shift()
    } else {
      conf = new FormatoConfig()
    }

    conf.formato = FORM
    conf.pais = PAIS
    conf.producto = PROD
    await conf.save()
  }

  // Eliminar Elementos Restantes
  for (const ITEM of TOREM) {
    const CONF = await FormatoConfig.findOne({
      select: [ 'id' ],
      where: { id: ITEM.id }
    })

    if (CONF != null) {
      await FormatoConfig.remove(CONF)
    }
  }

  res.apiRest.send()
}
