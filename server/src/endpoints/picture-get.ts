import { PICTURE_FILE } from './picture-file';
import { EndPoint } from '../tool/end-point';
import { Picture } from '../models/picture';
import { ValidateRequest } from '../tool/validate-request';

interface PictureOut extends Picture {
  url?: string;
}

export const PICTURE_GET = new EndPoint()
PICTURE_GET.method = 'get'
PICTURE_GET.path = 'picture/get/:id?'
PICTURE_GET.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession())
  ) {
    return
  }

  const id = req.params.id
  let data: PictureOut[]

  // Realizar búsqueda
  if (id == null) {
    data = await Picture.find()
  } else if (id.match(/^[0-9]+$/gi) != null) {
    data = await Picture.find({ id: parseInt(id, 10) })
  } else {
    res.apiRest.fail(400, 'El ID ingresado solo debe de ser del tipo numérico.')
    return
  }

  // Agregar URL
  for (let i = 0; i < data.length; i++) {
    data[i].url = req.protocol + '://' + req.headers.host + PICTURE_FILE.path
    data[i].url = data[i].url.replace(/:id\?/gi, String(data[i].id))
  }

  res.apiRest.send(data)
}