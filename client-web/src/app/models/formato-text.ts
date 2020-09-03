import { Fuente } from './fuente';
import { Etiqueta } from './etiqueta';
import { Regex } from 'src/app/utils/regex';
import { Parser } from 'src/app/utils/parser';
import * as moment from 'moment';

export class FormatoText {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  text: string;
  align: 'left' | 'right' | 'center' | 'justify';
  fontSize: number;
  fuente: Fuente;
  printOriginal: boolean;
  printCopy: boolean;


  public loadData(data: Etiqueta) {
    const all = this.text
      .match(/\{\s*[a-z0-9-_]+(\.[a-z0-9\-_]+)*\s*\}/gi);
    if (!all) {
      return;
    }

    for (const expr of all) {
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
            this.text = reg.replaceIn(
              this.text,
              data.barcode
            );
          }
        },
        {
          pattern: /\{\s*codanimal\s*\}/gi,
          callback: () => {
            this.text = reg.replaceIn(
              this.text,
              data.codAnimal
            );
          }
        },
        {
          pattern: /\{\s*peso\.neto\s*\}/gi,
          callback: () => {
            const parsed = new Parser(data.pesoNeto);
            parsed.sepInt = ',';
            parsed.sepDec = '.';

            this.text = reg.replaceIn(
              this.text,
              parsed.toString(2)
            );
          }
        },
        {
          pattern: /\{\s*peso\.bruto\s*\}/gi,
          callback: () => {
            const parsed = new Parser(data.pesoBruto);
            parsed.sepInt = ',';
            parsed.sepDec = '.';

            this.text = reg.replaceIn(
              this.text,
              parsed.toString(2)
            );
          }
        },
        {
          pattern: /\{\s*fecha\.faena\.year\s*\}/gi,
          callback: () => {
            this.text = reg.replaceIn(
              this.text,
              moment(data.fechaFaena).format('YYYY')
            );
          }
        },
        {
          pattern: /\{\s*fecha\.faena\.month\s*\}/gi,
          callback: () => {
            this.text = reg.replaceIn(
              this.text,
              moment(data.fechaFaena).format('MM')
            );
          }
        },
        {
          pattern: /\{\s*fecha\.faena\.day\s*\}/gi,
          callback: () => {
            this.text = reg.replaceIn(
              this.text,
              moment(data.fechaFaena).format('DD')
            );
          }
        },
        {
          pattern: /\{\s*fecha\.producc\.year\s*\}/gi,
          callback: () => {
            this.text = reg.replaceIn(
              this.text,
              moment(data.fechaProducc).format('YYYY')
            );
          }
        },
        {
          pattern: /\{\s*fecha\.producc\.month\s*\}/gi,
          callback: () => {
            this.text = reg.replaceIn(
              this.text,
              moment(data.fechaProducc).format('MM')
            );
          }
        },
        {
          pattern: /\{\s*fecha\.producc\.day\s*\}/gi,
          callback: () => {
            this.text = reg.replaceIn(
              this.text,
              moment(data.fechaProducc).format('DD')
            );
          }
        },
        {
          pattern: /\{\s*fecha\.vencim\.year\s*\}/gi,
          callback: () => {
            this.text = reg.replaceIn(
              this.text,
              moment(data.fechaVencim).format('YYYY')
            );
          }
        },
        {
          pattern: /\{\s*fecha\.vencim\.month\s*\}/gi,
          callback: () => {
            this.text = reg.replaceIn(
              this.text,
              moment(data.fechaVencim).format('MM')
            );
          }
        },
        {
          pattern: /\{\s*fecha\.vencim\.day\s*\}/gi,
          callback: () => {
            this.text = reg.replaceIn(
              this.text,
              moment(data.fechaVencim).format('DD')
            );
          }
        },
        {
          pattern: /\{\s*lotecertif\s*\}/gi,
          callback: () => {
            this.text = reg.replaceIn(
              this.text,
              String(data.loteCertif)
            );
          }
        },
        {
          pattern: /\{\s*contrato\s*\}/gi,
          callback: () => {
            this.text = reg.replaceIn(
              this.text,
              String(data.contrato)
            );
          }
        },
        {
          pattern: /\{\s*prod\.cod\s*\}/gi,
          callback: () => {
            if (!data.producto) {
              this.text = reg.replaceIn(
                this.text,
                '{ VACIO }'
              );
            } else {
              this.text = reg.replaceIn(
                this.text,
                data.producto.codigo
              );
            }
          }
        },
        {
          pattern: /\{\s*prod\.fam\s*\}/gi,
          callback: () => {
            if (!data.producto) {
              this.text = reg.replaceIn(
                this.text,
                '{ VACIO }'
              );
            } else {
              this.text = reg.replaceIn(
                this.text,
                data.producto.familia.codigo
              );
            }
          }
        },
        {
          pattern: /\{\s*prod\.det\.[a-z0-9\-_]+\s*\}/gi,
          callback: () => {
            const cod = expr.replace(/(\{\s*prod\.det\.|\s*\})/gi, '')
              .toLowerCase();

            if (!data.producto) {
              this.text = reg.replaceIn(
                this.text,
                '{ VACIO }'
              );
            } else if (data.producto.productoDet.length > 0) {
              let foundLang = false;
              for (const det of data.producto.productoDet) {
                if (cod === det.language.codigo.toLowerCase()) {
                  this.text = reg.replaceIn(
                    this.text,
                    det.descripc
                  );

                  foundLang = true;
                  break;
                }
              }

              if (!foundLang) {
                this.text = reg.replaceIn(
                  this.text,
                  '{ prod.det.NOT_FOUND }'
                );
              }
            } else {
              this.text = reg.replaceIn(
                this.text,
                '{ VACIO }'
              );
            }
          }
        }
      );

      if (!found) {
        this.text = reg.replaceIn(this.text, '{ ERROR }');
      }
    }

    // Add Enter
    this.text = this.text.replace(/\n+/gi, '<br />');
  }
}
