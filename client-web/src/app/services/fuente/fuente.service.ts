import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Fuente } from '../../models/fuente';
export { Fuente };

@Injectable({
  providedIn: 'root'
})
export class FuenteService {
  constructor(
    private httpServ: HttpService
  ) { }

  getAll() {
    return this.httpServ.get<Fuente[]>('/api/fuente/get');
  }
}
