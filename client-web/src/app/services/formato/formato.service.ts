import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

import { Formato, FormatoRect, FormatoText, Fuente, FormatoConfig } from '../../models';
export { Formato, FormatoRect, FormatoText, Fuente, FormatoConfig };

export interface IRawConfig {
  id: number;
  paisId: number;
  productoId: number;
}

@Injectable({
  providedIn: 'root'
})
export class FormatoService {

  constructor(
    private httpServ: HttpService
  ) { }

  get(codigo: string) {
    return this.httpServ.get<Formato>('/api/formato/get/' + codigo);
  }

  getAll() {
    return this.httpServ.get<Formato[]>('/api/formato/get/');
  }

  add(data: Formato) {
    return this.httpServ.post<Formato>('/api/formato/add', data);
  }

  remove(id: number) {
    return this.httpServ.delete<void>(`/api/formato/del/${id}`);
  }

  update(data: Formato) {
    return this.httpServ.post<Formato>('/api/formato/update', data);
  }

  updateDeep(data: Formato) {
    return this.httpServ.post<Formato>('/api/formato/update?deep=true', data);
  }

  getConfig(id: number) {
    return this.httpServ.get<FormatoConfig[]>(`/api/formato/get/${id}/config`);
  }

  setConfig(id: number, data: IRawConfig[]) {
    return this.httpServ.post<void>(`/api/formato/set/${id}/config`, data);
  }
}
