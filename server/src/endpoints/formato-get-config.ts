import { EndPoint } from '../tool/end-point';
import { Formato } from '../models/formato';
import { FormatoConfig } from '../models/formato-config';
import { exec } from 'child_process';
import { Language } from '../models/language';
import { Pais } from '../models/pais';
import { Familia } from '../models/familia';
import { ValidateRequest } from '../tool/validate-request';

export const FORMATO_GET_CONFIG = new EndPoint()
FORMATO_GET_CONFIG.method = 'get'
FORMATO_GET_CONFIG.path = 'formato/get/:id/config'
FORMATO_GET_CONFIG.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) {
    res.apiRest.fail(400, 'La id suministrada solo debe de tener caracteres numéricos.')
    return
  }
  
  const lang = await Language.findOne({ default: true })
  const setter: any[] = await FormatoConfig
    .createQueryBuilder('Conf')
    .innerJoinAndSelect(
      'Conf.pais',
      'Pais'
    )
    .innerJoinAndSelect(
      'Conf.producto',
      'Prod'
    )
    .innerJoinAndSelect(
      'Prod.familia',
      'Fami'
    )
    .innerJoinAndSelect(
      'Prod.productoDet',
      'Deta',
      'Deta.languageId = :languageId', 
      { languageId: lang.id }
    )
    .innerJoinAndSelect(
      'Conf.formato',
      'Form',
      'Form.id = :id',
      {
        id: id
      }
    )
    .where(
      'Conf.isActive = :isActive',
      { isActive: true }
    )
    .select([
      'Conf.id as id',
      'Pais.id',
      'Pais.codigo',
      'Pais.descripc',
      'Form.id',
      'Form.codigo',
      'Form.descripc',
      'Prod.id',
      'Prod.codigo',
      'Deta.descripc',
      'Fami.id',
      'Fami.codigo',
      'Fami.descripc'
    ])
    .execute()
    
    // Fix properties
    for (const item of setter) {
      // País
      item.pais = new Pais()
      item.pais.id = item['Pais_id']
      item.pais.codigo = item['Pais_codigo']
      item.pais.descripc = item['Pais_descripc']
      delete item['Pais_id']
      delete item['Pais_codigo']
      delete item['Pais_descripc']

      // Formato
      item.formato = new Formato()
      item.formato.id = item['Form_id']
      item.formato.codigo = item['Form_codigo']
      item.formato.descripc = item['Form_descripc']
      delete item['Form_id']
      delete item['Form_codigo']
      delete item['Form_descripc']
      
      // Productos
      item.producto = new Formato()
      item.producto.id = item['Prod_id']
      item.producto.codigo = item['Prod_codigo']
      item.producto.descripc = item['Deta_descripc']
      delete item['Prod_id']
      delete item['Prod_codigo']
      delete item['Deta_descripc']

      // Familia
      item.producto.familia = new Familia()
      item.producto.familia.id = item['Fami_id']
      item.producto.familia.codigo = item['Fami_codigo']
      item.producto.familia.descripc = item['Fami_descripc']
      delete item['Fami_id']
      delete item['Fami_codigo']
      delete item['Fami_descripc']
    }

  res.apiRest.send(setter)
}