import { APP_CONFIG } from '..';
import { EndPoint } from '../tool/end-point';
import { Picture } from '../models/picture';
import { File } from '../tool/file';
import { ValidateRequest } from '../tool/validate-request';

export const PICTURE_FILE = new EndPoint()
PICTURE_FILE.method = 'get'
PICTURE_FILE.path = 'picture/file/:id?'
PICTURE_FILE.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession())
  ) {
    return
  }

  const id = req.params.id
  if (id.match(/^[0-9]+$/gi) == null) {
    res.apiRest.fail(400, 'La búsqueda solo admite carácteres numéricos.')
    return
  }

  const pict = await Picture.findOne({ id: parseInt(id, 10) })
  if (pict == null) {
    res.apiRest.fail(404, 'La imagen solicitada no existe.')
    return
  }

  const file = new File(APP_CONFIG.folder.img + '/' + pict.nombre + '.' + pict.ext)
  if (!file.exist) {
    res.apiRest.fail(500, 'El archivo solicitado está corrupto o inaccesible.')
  } else {
    res.sendFile(file.path)
  }
}
