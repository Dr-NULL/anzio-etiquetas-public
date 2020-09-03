import { imageSize } from 'image-size';
import { Picture } from '../models/picture';
import { EndPoint } from '../tool/end-point';
import { FileStream } from '../tool/file-stream';
import { APP_CONFIG } from '..';
import { ValidateRequest } from '../tool/validate-request';

export const PICTURE_ADD = new EndPoint()
PICTURE_ADD.method = 'post'
PICTURE_ADD.path = 'picture/add'
PICTURE_ADD.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  const stream = new FileStream(req, APP_CONFIG.folder.img)
  const hName = stream.name

  await stream.download()
  const size = imageSize(stream.path)
  const img = new Picture()
  img.nombre = stream.name
  img.descripc = hName
  img.ext = stream.ext
  img.width = size.width
  img.height = size.height
  await img.save()

  res.apiRest.send({
      folder: stream.folder,
      name: stream.name
  })
}
