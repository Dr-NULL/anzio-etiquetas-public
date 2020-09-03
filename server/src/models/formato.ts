import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinColumn, ManyToOne } from 'typeorm';
import PDFDocument from 'pdfkit';

import { FormatoText } from './formato-text';
import { FormatoRect } from './formato-rect';
import { FormatoPict } from './formato-pict';
import { Printer } from './printer';

import * as path from 'path';
import * as fs from 'fs';

import '../tool/capitalize';
import { APP_CONFIG } from '..';
import { Picture } from './picture';
import { File } from '../tool/file';
import { generateName } from '../tool/name-gen';

@Entity({ name: 'Formato' })
export class Formato extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 10, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 100 })
  descripc: string;

  @Column({ type: 'int' })
  width: number;

  @Column({ type: 'int' })
  height: number;

  @Column({ type: 'bit', default: 1 })
  isActive: boolean;

  @OneToMany(type => FormatoText, FormatoText => FormatoText.formato, { eager: true })
  formatoText: FormatoText[];

  @OneToMany(type => FormatoRect, FormatoRect => FormatoRect.formato, { eager: true })
  formatoRect: FormatoRect[];

  @OneToMany(type => FormatoPict, FormatoPict => FormatoPict.formato, { eager: true })
  formatoPict: FormatoPict[];

  @OneToMany(type => Printer, Printer => Printer.formato, { eager: true })
  printers: Printer[];

  async save() {
    this.codigo = this.codigo.toUpperCase()
    this.descripc = this.descripc.capitalize()
    return super.save()
  }

  async getPictures() {
    const relat = await FormatoPict.find({
      formato: this
    })

    const pict: Array<Picture> = []
    for (const item of relat) {
      pict.push(item.picture)
    }

    return pict
  }

  async addPicture(id: number, x: number, y: number, width: number, height: number) {
    const img = await Picture.findOne(id)
    if (img == null) {
      throw new Error('La imagen especificada no existe.')
    }

    const rel = new FormatoPict()
    rel.formato = this
    rel.picture = img
    rel.x = x
    rel.y = y
    rel.width = width
    rel.height = height
    await rel.save()
  }

  async remPicture(id: number) {
    const relat = await FormatoPict.find({
      formato: this
    })

    for (const item of relat) {
      if (item.picture.id == id) {
        await item.remove()
      }
    }
  }

  genPDF(copyOf?: number) {
    return new Promise<File>(async (resolve, reject) => {
      try {
        // Borrar Archivo Anterior
        const file = new File(path.resolve('..', APP_CONFIG.folder.pdf, generateName('pdf', 8)))
        file.makeFolder()
        if (file.exist) {
          file.delete()
        }
    
        // Crear Nuevo Documento
        const dcto = new PDFDocument({
          size: [this.mm(this.width), this.mm(this.height)],
          margin: this.mm(0)
        })
        const stream = fs.createWriteStream(file.path)
        stream.on('finish', () => {
          resolve(file)
        })
        stream.on('error', err => {
          reject(err)
        })
        dcto.pipe(stream)

        // Iterar Detalle Documento (Imagen)
        for (const img of this.formatoPict) {
          dcto.image(
            APP_CONFIG.folder.img + `${img.picture.nombre}.${img.picture.ext}`,
            this.mm(img.x),
            this.mm(img.y),
            {
              fit: [this.mm(img.width), this.mm(img.height)],
              align: 'center',
              valign: 'center'
            }
          )
        }

        // Iterar Detalle Documento (Rectángulos)
        for (const rect of this.formatoRect) {
          if (rect.cornerRadius > 0) {
            dcto.roundedRect(
              this.mm(rect.x),
              this.mm(rect.y),
              this.mm(rect.width),
              this.mm(rect.height),
              this.mm(rect.cornerRadius)
            )
              .lineWidth(this.mm(rect.lineWidth))
              .strokeColor(rect.color)
              .stroke()
          } else {
            dcto.rect(
              this.mm(rect.x),
              this.mm(rect.y),
              this.mm(rect.width),
              this.mm(rect.height)
            )
              .lineWidth(this.mm(rect.lineWidth))
              .strokeColor(rect.color)
              .stroke()
    
          }
        }

        // Iterar Detalle Documento (Texto)
        for (const text of this.formatoText) {
          if (
            (text.printOriginal && !copyOf) ||
            (text.printCopy && copyOf)
          ) {
            dcto.font(path.join(APP_CONFIG.folder.fonts, text.fuente.filename))
            dcto.fontSize(text.fontSize)
            this.rotate(dcto, text)
            dcto.text(
              text.text,
              this.mm(text.x),
              this.mm(text.y),
              {
                width: this.mm(text.width),
                height: this.mm(text.height),
                align: text.align,
                baseline: text.baseline
              }
            )
            this.rotate(dcto, text, true)
          }
        }

        dcto.end()
      } catch (err) {
        reject(err)
      }
    })
  }

  private mm(length: number) {
    return (length / 25.4) * 72
  }

  private rotate(dcto: PDFKit.PDFDocument, data: Vektor, invert: boolean = false) {
    if (data.angle != 0) {
      let angle = data.angle
      if (invert) {
        angle *= -1
      }

      dcto.rotate(
        angle,
        {
          origin: [
            this.mm(data.x),
            this.mm(data.y)
          ]
        }
      )
    }
  }
}

interface Vektor {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
}