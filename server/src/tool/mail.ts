import { createTransport, Transporter } from 'nodemailer';
import { readFileSync } from 'fs';
import { Regex } from './regex';

export interface Transport {
  host: string;
  port: number;
  user: string;
  pass: string;
}

export class Mail {
  private _trans: Transporter;
  private _from : string;
  
  private _to : string[];
  public get to() : string[] {
    return this._to;
  }
  public set to(v : string[]) {
    if (!v) {
      v = [];
    }

    this._to = v;
  }
  
  private _subject : string;
  public get subject() : string {
    return this._subject;
  }
  public set subject(v : string) {
    this._subject = v;
  }

  public constructor(
    transport: Transport
  ) {
    this._from = transport.user
    this._to = []

    this._trans = createTransport({
      host: transport.host,
      port: transport.port,
      secure: (transport.port === 465) ? true : false,
      auth: {
        user: transport.user,
        pass: transport.pass
      }
    });
  }

  public sendHtml(html: string) {
    if (!this._to) {
      throw new Error('No se puede enviar un correo sin destinatario.')
    } else if (this._to.length === 0) {
      throw new Error('No se puede enviar un correo sin destinatario.')
    }

    let to = ''
    this._to.forEach((mail, i) => {
      if (i > 0) {
        to += ', '
      }
      to += mail
    })

    let subject = 'no-title'
    if (this._subject) {
      subject = this._subject
    }

    return this._trans.sendMail({
      from: this._from,
      to,
      subject,
      html 
    })
  }

  private static regex(strict: boolean = false) {
    let expr = '[a-z0-9]+([-+._][a-z0-9]+){0,2}@.*?(\\.(a'
      + '(?:[cdefgilmnoqrstuwxz]|ero|(?:rp|si)a)|b(?:[abde'
      + 'fghijmnorstvwyz]iz)|c(?:[acdfghiklmnoruvxyz]|at|o'
      + '(?:m|op))|d[ejkmoz]|e(?:[ceghrstu]|du)|f[ijkmor]|'
      + 'g(?:[abdefghilmnpqrstuwy]|ov)|h[kmnrtu]|i(?:[delm'
      + 'noqrst]|n(?:fo|t))|j(?:[emop]|obs)|k[eghimnprwyz]'
      + '|l[abcikrstuvy]|m(?:[acdeghklmnopqrstuvwxyz]|il|o'
      + 'bi|useum)|n(?:[acefgilopruz]|ame|et)|o(?:m|rg)|p('
      + '?:[aefghklmnrstwy]|ro)|qa|r[eosuw]|s[abcdeghijklm'
      + 'nortuvyz]|t(?:[cdfghjklmnoprtvwz]|(?:rav)?el)|u[a'
      + 'gkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw])\\b){1,2}';
  
    if (strict) {
      expr = '^' + expr + '$';
    }
  
    return new Regex(expr, 'gi');
  }

  public static isValid(address: string) {
    const reg = Mail.regex(true)
    return reg.matchIn(address).length > 0
  }

  public static find(text: string) {
    const reg = Mail.regex(false)
    return reg.matchIn(text)
  }
}