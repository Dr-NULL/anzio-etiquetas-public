import { readFileSync } from 'fs';
import mjml2html from 'mjml';

export interface Dictionary {
  [key: string]: any;
}

export class HtmlParser {
  private _html: string;
  public get html(): string {
    return this._html;
  }
  
  private _data : Dictionary;
  public get data() : Dictionary {
    return this._data;
  }
  public set data(v : Dictionary) {
    this._data = v;
  }

  public constructor(html: string, data?: Dictionary) {
    this._html = html
    this._data = data
  }

  public static fromHtmlFile(path: string, data?: Dictionary) {
    try {
      const html = readFileSync(path, { encoding: 'utf8' })
      return new HtmlParser(html, data)
    } catch (err) {
      throw new Error('No se puede acceder al archivo fuente.')
    }
  }

  public static fromMjmlFile(path: string, data?: Dictionary) {
    try {
      let mjml = readFileSync(path, { encoding: 'utf8' })
      mjml = mjml2html(mjml).html
      
      return new HtmlParser(mjml, data)
    } catch (err) {
      throw new Error('No se puede acceder al archivo fuente.')
    }
  }

  public build() {
    if (!this._data) {
      return this._html
    }

    const keys = Object.keys(this._data)
    if (keys.length === 0) {
      return this._html
    }

    let html = this._html
    for (const key of keys) {
      const reg = new RegExp(`\\{\\{\\s+this\.${key}\\s+\\}\\}`, 'gi')
      html = html.replace(reg, `${this._data[key]}`)
    }

    return html
  }
}