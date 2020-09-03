import { EndPoint } from '../tool/end-point';
import { Producto } from '../models/producto';
import { ProductoDet } from '../models/producto-det';
import { Language } from '../models/language';
import { ValidateRequest } from '../tool/validate-request';

export const PRODUCTO_GET = new EndPoint()
PRODUCTO_GET.method = 'get'
PRODUCTO_GET.path = 'producto/get/:id?'
PRODUCTO_GET.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  const id = (req.params.id != null) ? parseInt(req.params.id, 10) : null
  if (isNaN(id)) {
    res.apiRest.fail(
      400,
      'El id entregado es inválido, solo se aceptan carácteres numéricos.'
    )
    return
  }

  if (!req.params.id) {
    // Buscar productos
    const lang = await Language.findOne({ default: true })
    const data: any[] = await Producto
      .createQueryBuilder('Prod')
      .leftJoinAndSelect(
        'Prod.familia',
        'Fami'
      )
      .leftJoinAndSelect(
        'Prod.productoDet', 
        'Deta', 
        'Deta.languageId = :id', 
        { id: lang.id }
      )
      .select([
        'Prod.id as id',
        'Prod.codigo as codigo',
        'Deta.descripc as descripc',
        'Fami.id',
        'Fami.codigo',
        'Fami.descripc'
      ])
      .where('Prod.isActive = :isActive', { isActive: 1 })
      .orderBy('Fami.descripc', 'ASC')
      .orderBy('Deta.descripc', 'ASC')
      .execute()

    for (const item of data) {
      item.familia = {
        id: item['Fami_id'],
        codigo: item['Fami_codigo'],
        descripc: item['Fami_descripc']
      }

      delete item['Fami_id']
      delete item['Fami_codigo']
      delete item['Fami_descripc']
    }

    res.apiRest.send(data)
  } else {
    // Buscar Producto
    const main = await Producto.findOne({
      select: [
        'id',
        'codigo'
      ],
      relations: [
        'familia',
      ],
      where: {
        id
      }
    })

    if (!main) {
      res.apiRest.fail(
        404,
        'El registro que se solicitó no existe.'
      )
      return
    } else {
      main.productoDet = []
    }

    // Buscar Detalles
    const desc: RawDetail[] = await ProductoDet
      .createQueryBuilder('det')
      .select([
        'det.id as id',
        'det.descripc as descripc',
        'lng.id as languageId'
      ])
      .leftJoin(
        Language,
        'lng',
        'det.languageId = lng.id'
      )
      .where(
        'det.productoId = :id',
        { id: main.id }
      )
      .orderBy(
        'lng.descripc',
        'ASC'
      )
      .orderBy(
        'lng.default',
        'DESC'
      )
      .execute()
    
    // Asignar idiomas
    for (const raw of desc) {
      const item = new ProductoDet()
      item.id = raw.id
      item.descripc = raw.descripc
      item.language = await Language.findOne({
        id: raw.languageId
      })

      main.productoDet.push(item)
      if (item.language.default) {
        main.descripc = raw.descripc
      }
    }

    res.apiRest.send(main)
  }
}

interface RawDetail {
  id: number;
  descripc: string;
  languageId: number;
}