import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

import { UsuarioTipo } from 'src/app/models';
export { UsuarioTipo };

@Injectable({
  providedIn: 'root'
})
export class UsuarioTipoService {

  constructor(
    private httpServ: HttpService
  ) { }

  public getAll() {
    return this.httpServ.get<UsuarioTipo[]>(
      'api/usuario-tipo/get'
    );
  }
}
