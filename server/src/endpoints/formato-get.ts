import { EndPoint } from '../tool/end-point';
import { Formato } from '../models/formato';
import { ValidateRequest } from '../tool/validate-request';

export const FORMATO_GET = new EndPoint()
FORMATO_GET.method = 'get'
FORMATO_GET.path = 'formato/get/:codigo?'
FORMATO_GET.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  if (req.params.codigo == null) {
    // Listar todos los formatos existentes
    const resp = await Formato.createQueryBuilder()
    .select([
      'id',
      'codigo',
      'descripc',
      'width',
      'height',
      'isActive'
    ])
    .orderBy('codigo', 'ASC')
    .execute()
    res.apiRest.send(resp)

  } else {
    // Buscar la etiqueta especificada
    const label = await Formato.findOne({
      codigo: req.params.codigo,
      isActive: true
    })
    
    if (label == null) {
      res.apiRest.fail(
        404,
        'El formato de etiqueta que solicita no existe.'
      )
    } else {
      res.apiRest.send(label)
    }
  }
}