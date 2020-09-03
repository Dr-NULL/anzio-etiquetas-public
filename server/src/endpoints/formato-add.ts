import { EndPoint } from '../tool/end-point';
import { Formato } from '../models/formato';
import { Like } from 'typeorm';
import '../tool/capitalize';
import { ValidateRequest } from '../tool/validate-request';

export const FORMATO_ADD = new EndPoint()
FORMATO_ADD.method = 'post'
FORMATO_ADD.path = 'formato/add'
FORMATO_ADD.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  validate.keys = [
    { key: 'codigo',    type: 'String'  },
    { key: 'descripc',  type: 'String'  },
    { key: 'width',     type: 'Number'  },
    { key: 'height',    type: 'Number'  }
  ]
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath()) ||
    (!validate.checkBody())
  ) {
    return
  }

  // Validar integridad de datos
  if (
    (typeof (req.body as Formato).codigo != 'string') ||
    (typeof (req.body as Formato).descripc != 'string') ||
    (typeof (req.body as Formato).width != 'number') ||
    (typeof (req.body as Formato).height != 'number')
  ) {
    // Lanzar Error
    res.apiRest.fail(
      400, 
        'No se pudo agregar el nuevo elemento debido a que el '
        + 'formato de los datos enviados por el cliente es inválido.'
    )
  } else {
    const obj = new Formato()
    obj.codigo = (req.body as Formato).codigo.trim().toUpperCase()
    obj.descripc = (req.body as Formato).descripc.trim().capitalize()
    obj.width = (req.body as Formato).width
    obj.height = (req.body as Formato).height
    
    // Buscar si el código está repetido
    const fnd = await Formato.find({ codigo: Like(obj.codigo) })
    if (fnd.length > 0) {
      res.apiRest.fail(
        406,
          `El código "${obj.codigo}" ya se encuentra registrado `
        + 'en el sistema. Por favor ingrese uno que no exista en el sistema.'
      )
    } else {
      await obj.save()
      res.apiRest.send(obj)
    }
  }
}