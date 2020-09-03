import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

import { Pais } from 'src/app/models';
export { Pais };

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  constructor(
    private httpServ: HttpService
  ) { }

  getAll() {
    return this.httpServ.get<Pais[]>(
      '/api/pais/get/'
    );
  }
}
