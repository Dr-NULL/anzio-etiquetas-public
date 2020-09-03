import { Injectable } from '@angular/core';
import { HttpService, Http } from '../http/http.service';
import { Producto } from 'src/app/models/producto';

export { Producto };

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(
    private httpServ: HttpService
  ) { }

  getAll() {
    return this.httpServ.get<Producto[]>('/api/producto/get');
  }

  get(id: number) {
    return this.httpServ.get<Producto>(`/api/producto/get/${id}`);
  }

  setDetails(id: number, data: Detail[]) {
    return this.httpServ.put<void>(`api/producto/set/${id}/detail`, data);
  }
}

// Custom Data
export interface Detail {
  descripc: string;
  langId: number;
}
