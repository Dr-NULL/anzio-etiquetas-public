import { Request, Response } from 'express';
import { Usuario } from '../models/usuario';
import { Menu } from '../models/menu';

import { checker, def } from './checker';

export interface KeyCheck {
  key: string;
  type: def;
  length?: number;
}

export class ValidateRequest {
  private _snd: boolean;
  private _req: Request;
  private _res: Response;

  private _key: KeyCheck[];
  public get keys(): KeyCheck[] {
    return this._key;
  }
  public set keys(v: KeyCheck[]) {
    if (!v) {
      this._key = [];
    } else {
      this._key = v;
    }
  }
  
  private _msgNoLogged : string;
  public get msgNoLogged() : string {
    return this._msgNoLogged;
  }
  public set msgNoLogged(v : string) {
    this._msgNoLogged = v;
  }
  
  private _msgNoAuth : string;
  public get msgNoAuth() : string {
    return this._msgNoAuth;
  }
  public set msgNoAuth(v : string) {
    this._msgNoAuth = v;
  }
  
  private _msgBadReq : string;
  public get msgBadReq() : string {
    return this._msgBadReq;
  }
  public set msgBadReq(v : string) {
    this._msgBadReq = v;
  }
  
  private _msgBadReqLength : string;
  public get msgBadReqLength() : string {
    return this._msgBadReqLength;
  }
  public set msgBadReqLength(v : string) {
    this._msgBadReqLength = v;
  }

  /**
   * Check if the current HTTP Request is valid, reading the body and the session.
   * @param req Request of the EndPoint.
   * @param res Response of the EndPoint.
   */
  public constructor(req: Request, res: Response) {
    this._msgNoLogged     = 'Este recurso no está disponible, necesita de iniciar sesión '
                          + 'para su uso.'
    this._msgNoAuth       = 'Este recurso no está disponible, requiere de privilegios '
                          + 'de nivel superior para su uso.'
    this._msgBadReq       = 'El campo "{ key }" no posee el formato correcto. El campo '
                          + 'debe de ser del tipo "{ type }".'
    this._msgBadReqLength = 'El campo "{ key }" no posee el formato correcto. El campo '
                          + 'debe de ser del tipo "{ type }" y tener un largo mínimo '
                          + 'de { length } caracteres.'

    this._snd = false;
    this._req = req;
    this._res = res;
    this._key = [];
  }

  public checkSession() {
    if (this._req.session.current && !this._snd) {
      this._req.session.rewind()
      return true
    } else {
      this._res.apiRest.fail(401, this._msgNoLogged)
      this._snd = true
      return false
    }
  }

  public async checkPath() {
    // Get user's menu
    const url = (() => {
      let port = ':' + this._req.connection.localPort
      if (
        (
          (this._req.protocol.toLowerCase() === 'http') &&
          (this._req.connection.localPort === 80)
        ) || (
          (this._req.protocol.toLowerCase() === 'https') &&
          (this._req.connection.localPort === 443)
        )
      ) {
        port = ''
      }

      const reg = new RegExp(`^${this._req.protocol}://${this._req.hostname}${port}/`, 'gi')
      return this._req.headers.referer.replace(reg, '')
    })()

    let found = false
    let menu: Menu[]
    if (this._req.session.current) {
      const self: Usuario = this._req.session.current.getData()
      const user = await Usuario.findOne({ id: self.id })
      menu = await Menu.getByType(user.usuarioTipo)
    } else {
      menu = await Menu.getByType()
    }

    const check = (x: Menu) => {
      // Recursive
      for (const y of x.children) {
        check(y);
        if (found) {
          return;
        }
      }

      if (x.path) {
        // Build Pattern
        const patt = x.path
          .replace(/\/:[0-9a-z-_]+\?/gi, '\/([^//]+)?')
          .replace(/\/:[0-9a-z-_]+/gi, '\/[^//]+')
          .replace(/(^\/|\/$)/gi, '');

        // Compare
        const reg = new RegExp(patt, 'gi');
        if (url.match(reg)) {
          found = true;
        }
      }
    }

    for (const item of menu) {
      check(item)
      if (found) {
        break
      }
    }

    // Send Response
    if (!found && !this._snd) {
      console.log(`url = "${url}"`)
      this._res.apiRest.fail(403, this._msgNoAuth)
      this._snd = true
    }

    return found
  }

  public checkBody() {
    const recursive = (obj: any, type: def, length: number, keys: string[]): boolean => {
      if (keys.length === 0) {
        return true
      }
      
      const key = keys.shift()
      if (keys.length > 0) {
        return recursive(obj[key], type, length, keys)
      }
      
      if (checker(obj[key]) !== type) {
        return false
      }
      
      if (type === 'String') {
        if ((!length) || (length < 0)) {
          length = 0
        }
        return obj[key].trim().length >= length
      } else {
        return true
      }
    }

    let ok = true
    const inspect = (obj: any) => {
      for (const item of this._key) {
        const key = item.key.split(/\./gi)
  
        ok = recursive(obj, item.type, item.length, key)
        if (!ok && !this._snd) {
          this._snd = true
          this._res.apiRest.fail(
            400,
            ((item.length) ? this._msgBadReqLength : this._msgBadReq)
              .replace(/\{\s*key\s*\}/gi, item.key)
              .replace(/\{\s*type\s*\}/gi, item.type)
              .replace(/\{\s*length\s*\}/gi, `${item.length}`)
          )
          break
        }
      }
    }
  
    const obj = this._req.body
    if (checker(obj) === 'Array') {
      for (const item of obj as any[]) {
        inspect(item)
        if (!ok) {
          break
        }
      }
    } else {
      inspect(obj)
    }

    return ok
  }
}