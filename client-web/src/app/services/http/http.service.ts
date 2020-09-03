import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Meta, Error } from './interfaces/http';
import { Router } from '@angular/router';
export { Http, Meta, Error };

const urlServer = '';
const urlClient = location.origin;

const HEADERS: { [key: string]: any } = {
  'content-type': 'application/vnd.api+json',
  'Access-Control-Allow-Origin': urlClient,
  'Set-Cookie': 'HttpOnly; Secure; SameSite=Strict'
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private httpServ: HttpClient,
    private router: Router
  ) { }

  /**
   * HTTP Request del tipo "GET". Se utiliza para solicitar un recurso al servidor.
   * @param url URL del recurso que se solicita.
   */
  async get<T = any>(url: string) {
    try {
      const path = urlServer + url;
      const requ = this.httpServ.get<Http<T>>(path, { headers: new HttpHeaders(HEADERS) });
      const prom = requ.toPromise();
      const resp = await prom;

      return resp as Http<T>;
    } catch (err) {
      throw this.handleError(url, err);
    }
  }

  /**
   * HTTP Request del tipo "POST". Se utiliza para crear o agregar un recurso al servidor.
   * @param url URL del recurso que se va a agregar.
   * @param data Datos del recurso a crear/insertar.
   */
  async post<T = any>(url: string, data: any) {
    try {
      const path = urlServer + url;
      const requ = this.httpServ.post<Http<T>>(path, JSON.stringify(data), { headers: new HttpHeaders(HEADERS) });
      const prom = requ.toPromise();
      const resp = await prom;

      return resp as Http<T>;
    } catch (err) {
      throw this.handleError(url, err);
    }
  }

  /**
   * HTTP Request del tipo "PUT". se utiliza para actualizar completamente los datos de un recurso existente en
   * el servidor. Sí permite la inserción de nuevos recursos.
   * @param url URL del recurso que se va a modificar.
   * @param data Datos del recurso a modificar.
   */
  async put<T = any>(url: string, data: any = null) {
    try {
      const path = urlServer + url;
      const requ = this.httpServ.put<Http<T>>(path, JSON.stringify(data), { headers: new HttpHeaders(HEADERS) });
      const prom = requ.toPromise();
      const resp = await prom;

      return resp as Http<T>;
    } catch (err) {
      throw this.handleError(url, err);
    }
  }

  /**
   * HTTP Request del tipo "PATCH". se utiliza para actualizar de forma parcial los datos de un recurso existente
   * en el servidor (por ejemplo solo cambiar uno o 2 campos de una entidad). No permite la inserción de nuevos
   * recursos.
   * @param url URL del recurso que se va a modificar.
   * @param data Datos del recurso a modificar.
   */
  async patch<T = any>(url: string, data: any) {
    try {
      const path = urlServer + url;
      const requ = this.httpServ.patch<Http<T>>(path, JSON.stringify(data), { headers: new HttpHeaders(HEADERS) });
      const prom = requ.toPromise();
      const resp = await prom;

      return resp as Http<T>;
    } catch (err) {
      throw this.handleError(url, err);
    }
  }

  async delete<T = any>(url: string) {
    try {
      const path = urlServer + url;
      const requ = this.httpServ.delete<Http<T>>(path, { headers: new HttpHeaders(HEADERS) });
      const prom = requ.toPromise();
      const resp = await prom;

      return resp as Http<T>;
    } catch (err) {
      throw this.handleError(url, err);
    }
  }

  async file<T = any>(url: string, data: File) {
    try {
      // configurar Headers con el tipado correspondiente
      const headerType: { [key: string]: any } = {};
      for (const key of Object.keys(HEADERS)) {
        headerType[key] = HEADERS[key];
      }
      headerType['content-type'] = data.type;
      headerType['content-disposition'] =
          'attachment; '
        + 'filename="'
        + encodeURI(data.name)
        + '"';

      const path = urlServer + url;
      const requ = this.httpServ.post<Http<T>>(path, data, { headers: new HttpHeaders(headerType) });
      const prom = requ.toPromise();
      const resp = await prom;

      return resp as Http<T>;
    } catch (err) {
      throw this.handleError(url, err);
    }
  }

  private handleError(url: string, resp: any): Error {
    if ((resp.status === 401) || (resp.status === 403)) {
      this.router.navigate([ '/' ]);
      return resp.error.error;
    } else if (resp.error == null) {
      return {
        status: 500,
        title: 'Internal Server Error',
        details: 'El servidor no responde, por favor contáctese con el depto. de informática.',
        source: {
          pointer: url
        }
      };
    } else if (resp.status === 0) {
      return {
        status: 500,
        title: resp.name,
        details: resp.message,
        source: {
          pointer: url
        }
      };
    } else {
      return resp.error.error;
    }
  }
}
