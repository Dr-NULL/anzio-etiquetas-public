import { EndPoint } from '../tool/end-point';
import { Fuente } from '../models/fuente';
import { Formato } from '../models/formato';
import { FormatoText } from '../models/formato-text';
import { FormatoRect } from '../models/formato-rect';
import { FormatoPict } from '../models/formato-pict';
import { Picture } from '../models/picture';
import { Like, Not } from 'typeorm';
import { ValidateRequest } from '../tool/validate-request';

export const FORMATO_UPDATE = new EndPoint()
FORMATO_UPDATE.method = 'post'
FORMATO_UPDATE.path = 'formato/update'
FORMATO_UPDATE.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  const raw: Formato = req.body
  const gen = await Formato.findOne({ id: raw.id })
  if (gen == null) {
    res.apiRest.fail(404, `La etiqueta que se desea actualizar no existe, intente con un registro válido.`)
    return
  }

  // Comprobar tipo de Edición
  const deep = `${req.query.deep}`.trim().toLowerCase()
  if (deep != 'true') {
    // Validar integridad de datos
    if (
      (typeof raw.id != 'number') ||
      (typeof raw.codigo != 'string') ||
      (typeof raw.descripc != 'string') ||
      (typeof raw.width != 'number') ||
      (typeof raw.height != 'number') ||
      (typeof raw.isActive != 'boolean')
    ) {
      // Lanzar Error
      res.apiRest.fail(
        400, 
          'No se pudo modificar el elemento debido a que el '
        + 'formato de los datos enviados por el cliente es inválido.'
      )
    } else {
      gen.codigo = raw.codigo.trim().toUpperCase()
      gen.descripc = raw.descripc.trim()
      gen.width = raw.width
      gen.height = raw.height
      gen.isActive = raw.isActive
      
      // Buscar si el código está repetido
      const fnd = await Formato.find({ codigo: Like(gen.codigo), id: Not(gen.id) })
      if (fnd.length > 0) {
        res.apiRest.fail(
          406,
            `El código "${gen.codigo}" ya se encuentra registrado `
          + 'en el sistema. Por favor ingrese uno que no exista en el sistema.'
        )
      } else {
        await gen.save()
        res.apiRest.send(gen)
      }
    }
  } else {
    // Recorrer Detalles Texto
    const detTexto: FormatoText[] = []
    for (const item of raw.formatoText) {
      let fnt: Fuente = await Fuente.findOne({ id: item.fuente.id })
      if (fnt == null) {
        res.apiRest.fail(404, `Se ingresó una fuente que no está registrada en nuestro sistema.`)
        return
      }

      let det: FormatoText
      if (item.id != null) {
        det = await FormatoText.findOne({ id: item.id })
        if (det == null) {
          res.apiRest.fail(404, 'Se ingresó un ítem en el detalle de tipo "texto" de la etiqueta un id que no existe.')
          return
        }
      } else {
        det = new FormatoText()
      }

      det.x = item.x
      det.y = item.y
      det.angle = item.angle
      det.width = item.width
      det.height = item.height
      det.text = item.text
      det.fontSize = item.fontSize
      det.fuente = fnt
      det.align = item.align
      det.printOriginal = item.printOriginal
      det.printCopy = item.printCopy
      detTexto.push(det)
    }

    // Recorrer Detalles Cuadros
    const detRect: FormatoRect[] = []
    for (const item of raw.formatoRect) {
      let det: FormatoRect;
      if (item.id != null) {
        det = await FormatoRect.findOne({ id: item.id })
        if (det == null) {
          res.apiRest.fail(404, 'Se ingresó un ítem en el detalle de tipo "rectángulo" de la etiqueta un id que no existe.')
          return
        }
      } else {
        det = new FormatoRect()
      }

      det.x = item.x
      det.y = item.y
      det.width = item.width
      det.height = item.height
      det.cornerRadius = item.cornerRadius
      det.lineWidth = item.lineWidth
      detRect.push(det)
    }

    // Recorrer Detalles Imágenes
    const detPict: FormatoPict[] = []
    for (const item of raw.formatoPict) {
      let det: FormatoPict;
      if (item.id != null) {
        det = await FormatoPict.findOne({ id: item.id })
        if (det == null) {
          res.apiRest.fail(404, 'Se ingresó un ítem en el detalle de tipo "imagen" de la etiqueta un id que no existe.')
          return
        }
      } else {
        det = new FormatoPict()
      }

      let pict: Picture;
      if (item.picture == null) {
        res.apiRest.fail(500, 'El registro de posicionamiento de imagen no posee ninguna imagen asociada.')
        return
      } else if (item.picture.id == null) {
        res.apiRest.fail(500, 'El registro de posicionamiento de imagen posee una imagen inválida.')
        return
      } else {
        pict = await Picture.findOne({ id: item.picture.id })
        if (pict == null) {
          res.apiRest.fail(500, 'El registro de posicionamiento de imagen posee una imagen que no se encuentra en nuestros registros.')
          return
        }
      }

      det.x = item.x
      det.y = item.y
      det.width = item.width
      det.height = item.height
      det.picture = pict
      detPict.push(det)
    }

    // Eliminar Elementos no Existentes
    for (const item of gen.formatoText) {
      const result = detTexto.find(x => x.id == item.id)
      if (result == null) {
        await item.remove()
      }
    }
    for (const item of gen.formatoRect) {
      const result = detRect.find(x => x.id == item.id)
      if (result == null) {
        await item.remove()
      }
    }
    for (const item of gen.formatoPict) {
      const result = detPict.find(x => x.id == item.id)
      if (result == null) {
        await item.remove()
      }
    }

    // Guardar Detalles
    for (const item of detTexto) {
      if (item.id == null) {
        gen.formatoText.push(item)
      }
      await item.save()
    }

    for (const item of detRect) {
      if (item.id == null) {
        gen.formatoRect.push(item)
      }
      await item.save()
    }

    for (const item of detPict) {
      if (item.id == null) {
        gen.formatoPict.push(item)
      }
      await item.save()
    }

    await gen.save()
    res.apiRest.send(gen)
  }
}
