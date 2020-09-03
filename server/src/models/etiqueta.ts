import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, Like, SaveOptions } from 'typeorm';
import moment, { utc } from 'moment';

import { Producto } from './producto';
import { Pais } from './pais';
import { FormatoConfig } from './formato-config';
import { Formato } from './formato';

import { File } from '../tool/file';
import { Regex } from '../tool/regex';
import { Parser } from '../tool/parser';
import { Barcode } from '../tool/barcode';
import { parse } from 'querystring';

@Entity({ name: 'Etiqueta' })
export class Etiqueta extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int', nullable: true })
  copyOf: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  barcode: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  codAnimal: string;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  pesoBruto: number;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  pesoNeto: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaImpres: Date;

  @Column({ type: 'datetime' })
  fechaFaena: Date;

  @Column({ type: 'date' })
  fechaProducc: Date;

  @Column({ type: 'date' })
  fechaVencim: Date;

  @Column({ type: 'bigint', nullable: true })
  loteRecepc: number;

  @Column({ type: 'bigint' })
  loteCertif: number;

  @Column({ type: 'bigint' })
  contrato: number;

  @ManyToOne(type => Producto, Producto => Producto.id, { eager: true })
  producto: Producto;

  @ManyToOne(type => Pais, Pais => Pais.id, { eager: true })
  pais: Pais;

  async build() {
    const data = await FormatoConfig.findFormato(this.pais, this.producto)
    for (let i = 0; i < data.length; i++) {
      for (let ii = 0; ii < data[i].formatoText.length; ii++) {
        // Buscar patrones comodines
        const item = data[i].formatoText[ii]
        const patt = new Regex(/\{\s*[a-z0-9-_]+(\.[a-z0-9\-_]+)*\s*\}/gi)
          .matchIn(item.text)
        
        patt.forEach(expr => {
          // Build reg expr for replace after
          const reg = new Regex(
            expr
              .replace(/\{/gi, '\\{')
              .replace(/\}/gi, '\\}')
              .replace(/\./gi, '\\.')
              .replace(/\s+/gi, '\\s+'),
            'gi'
          );
    
          // Search pattern
          const found = Regex.switch(
            expr,
            {
              pattern: /\{\s*barcode\s*\}/gi,
              callback: () => {
                item.text = reg.replaceIn(
                  item.text,
                  this.barcode
                );
              }
            },
            {
              pattern: /\{\s*codanimal\s*\}/gi,
              callback: () => {
                item.text = reg.replaceIn(
                  item.text,
                  this.codAnimal
                );
              }
            },
            {
              pattern: /\{\s*peso\.neto\s*\}/gi,
              callback: () => {
                const parsed = new Parser(this.pesoNeto);
                parsed.sepInt = ',';
                parsed.sepDec = '.';
    
                item.text = reg.replaceIn(
                  item.text,
                  parsed.getFormat(2)
                );
              }
            },
            {
              pattern: /\{\s*peso\.bruto\s*\}/gi,
              callback: () => {
                const parsed = new Parser(this.pesoBruto);
                parsed.sepInt = ',';
                parsed.sepDec = '.';
    
                item.text = reg.replaceIn(
                  item.text,
                  parsed.getFormat(2)
                );
              }
            },
            {
              pattern: /\{\s*fecha\.faena\.year\s*\}/gi,
              callback: () => {
                item.text = reg.replaceIn(
                  item.text,
                  moment(this.fechaFaena).format('YYYY')
                );
              }
            },
            {
              pattern: /\{\s*fecha\.faena\.month\s*\}/gi,
              callback: () => {
                item.text = reg.replaceIn(
                  item.text,
                  moment(this.fechaFaena).format('MM')
                );
              }
            },
            {
              pattern: /\{\s*fecha\.faena\.day\s*\}/gi,
              callback: () => {
                item.text = reg.replaceIn(
                  item.text,
                  moment(this.fechaFaena).format('DD')
                );
              }
            },
            {
              pattern: /\{\s*fecha\.producc\.year\s*\}/gi,
              callback: () => {
                item.text = reg.replaceIn(
                  item.text,
                  moment(this.fechaProducc).format('YYYY')
                );
              }
            },
            {
              pattern: /\{\s*fecha\.producc\.month\s*\}/gi,
              callback: () => {
                item.text = reg.replaceIn(
                  item.text,
                  moment(this.fechaProducc).format('MM')
                );
              }
            },
            {
              pattern: /\{\s*fecha\.producc\.day\s*\}/gi,
              callback: () => {
                item.text = reg.replaceIn(
                  item.text,
                  moment(this.fechaProducc).format('DD')
                );
              }
            },
            {
              pattern: /\{\s*fecha\.vencim\.year\s*\}/gi,
              callback: () => {
                item.text = reg.replaceIn(
                  item.text,
                  moment(this.fechaVencim).format('YYYY')
                );
              }
            },
            {
              pattern: /\{\s*fecha\.vencim\.month\s*\}/gi,
              callback: () => {
                item.text = reg.replaceIn(
                  item.text,
                  moment(this.fechaVencim).format('MM')
                );
              }
            },
            {
              pattern: /\{\s*fecha\.vencim\.day\s*\}/gi,
              callback: () => {
                item.text = reg.replaceIn(
                  item.text,
                  moment(this.fechaVencim).format('DD')
                );
              }
            },
            {
              pattern: /\{\s*lotecertif\s*\}/gi,
              callback: () => {
                item.text = reg.replaceIn(
                  item.text,
                  String(this.loteCertif)
                );
              }
            },
            {
              pattern: /\{\s*contrato\s*\}/gi,
              callback: () => {
                item.text = reg.replaceIn(
                  item.text,
                  String(this.contrato)
                );
              }
            },
            {
              pattern: /\{\s*prod\.cod\s*\}/gi,
              callback: () => {
                if (!this.producto) {
                  item.text = reg.replaceIn(
                    item.text,
                    '{ VACIO }'
                  );
                } else {
                  item.text = reg.replaceIn(
                    item.text,
                    this.producto.codigo
                  );
                }
              }
            },
            {
              pattern: /\{\s*prod\.fam\s*\}/gi,
              callback: () => {
                if (!this.producto) {
                  item.text = reg.replaceIn(
                    item.text,
                    '{ VACIO }'
                  );
                } else {
                  item.text = reg.replaceIn(
                    item.text,
                    this.producto.familia.codigo
                  );
                }
              }
            },
            {
              pattern: /\{\s*prod\.det\.[a-z0-9\-_]+\s*\}/gi,
              callback: () => {
                const cod = expr.replace(/(\{\s*prod\.det\.|\s*\})/gi, '')
                  .toLowerCase();
    
                if (!this.producto) {
                  item.text = reg.replaceIn(
                    item.text,
                    '{ VACIO }'
                  );
                } else if (this.producto.productoDet.length > 0) {
                  let foundLang = false;
                  for (const det of this.producto.productoDet) {
                    if (cod === det.language.codigo.toLowerCase()) {
                      item.text = reg.replaceIn(
                        item.text,
                        det.descripc
                      );
    
                      foundLang = true;
                      break;
                    }
                  }
    
                  if (!foundLang) {
                    item.text = reg.replaceIn(
                      item.text,
                      '{ prod.det.NOT_FOUND }'
                    );
                  }
                } else {
                  item.text = reg.replaceIn(
                    item.text,
                    '{ VACIO }'
                  );
                }
              }
            }
          )

          if (!found) {
            item.text = reg.replaceIn(
              item.text,
              '{ ERROR }'
            );
          }

          if (item.fuente.nombre.toLowerCase() == 'code-128') {
            item.text = Barcode.to128(item.text)
          }
          data[i].formatoText[ii].text = item.text
        })
      }
    }

    return data
  }

  public static async readFile(path: string) {
    const file = new File(path)
    const txt = file.readTextSync()
    const raw = txt
      .replace(/([^a-z0-9-_\.\|]|\|+$|^\|+)/gi, '')
      .split(/\|/gi)

    file.delete()
    if (raw.length != 12) {
      throw new Error('Archivo inválido, revise la cantidad de campos y reintente.')
    }

    // Crear nueva instancia en base de datos
    const pais = await Pais.findOne({ codigo: Like(raw[3].toUpperCase()) })
    const prod = await Producto.findOne({ codigo: Like(raw[2].toUpperCase()) })
    if (!pais) {
      throw new Error('No se ha encontrado el contrato endicado en la etiqueta.')
    }
    if (!prod) {
      throw new Error('No se ha encontrado el producto endicado en la etiqueta.')
    }

    const out = new Etiqueta()
    out.barcode = raw[0]
    out.codAnimal = raw[1]
    out.producto = prod
    out.pais = pais
    out.loteRecepc = Etiqueta.parseNum(raw[4])
    out.loteCertif = parseInt(raw[5])
    out.contrato = parseInt(raw[6])
    out.pesoBruto = parseFloat(raw[7].replace(/,/gi, '.'))
    out.pesoNeto = parseFloat(raw[8].replace(/,/gi, '.'))
    out.fechaFaena = this.parseDate(raw[9])
    out.fechaProducc = this.parseDate(raw[10])
    out.fechaVencim = this.parseDate(raw[11])
    await out.save()

    return out
  }

  private static parseDate(input: string) {
    const year = parseInt(input.substr(0, 4))
    const month = parseInt(input.substr(4, 2)) - 1
    const day = parseInt(input.substr(6, 2))

    return new Date(year, month, day)
  }

  private static parseNum(input: string): null | number {
    let parsed = parseInt(input, 10)

    if (isNaN(parsed)) {
      return null
    } else {
      parsed
    }
  }

  public async save(options?: SaveOptions): Promise<this> {
    // Search coincidences
    const orig = await Etiqueta.findOne({
      barcode: this.barcode,
      codAnimal: this.codAnimal,
      producto: this.producto,
      pais: this.pais,
      loteRecepc: this.loteRecepc,
      loteCertif: this.loteCertif,
      contrato: this.contrato,
      pesoBruto: this.pesoBruto,
      pesoNeto: this.pesoNeto,
      fechaFaena: this.fechaFaena,
      fechaProducc: this.fechaProducc,
      fechaVencim: this.fechaVencim
    })

    // Add the orginal id
    if (orig) {
      this.copyOf = orig.id
    }

    // Return the original method
    return super.save(options)
  }
}