import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Usuario, UsuarioTipo, UsuarioQueue } from 'src/app/models/';

import {
  CheckSystemUser,
  CheckSession
} from './interfaces';

export {
  Usuario,
  UsuarioTipo,
  CheckSystemUser
};

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(
    private httpServ: HttpService
  ) { }

  public checkSystemUser() {
    return this.httpServ.get<CheckSystemUser>(
      'api/usuario/chk/system'
    );
  }

  public addQueue(user: string, mail: string, usuarioTipoId: number) {
    return this.httpServ.post<void>(
      'api/usuario/add/queue',
      {
        user,
        mail,
        usuarioTipoId
      }
    );
  }

  public delQueue(id: number) {
    return this.httpServ.delete(
      `api/usuario/del/queue/${id}`
    );
  }

  public addQueueSystem(user: string, mail: string) {
    return this.httpServ.post<void>(
      'api/usuario/add/queue/system',
      {
        user,
        mail
      }
    );
  }

  public getQueue(token: string) {
    return this.httpServ.get<UsuarioQueue>(
      `api/usuario/get/queue/${token}`
    );
  }

  public getAllQueue() {
    return this.httpServ.get<UsuarioQueue[]>(
      `api/usuario/get/queue/`
    );
  }

  public addUser(data: Usuario, token?: string) {
    return this.httpServ.put<void>(
      'api/usuario/add',
      {
        ...data,
        token
      }
    );
  }

  public login(user: string, pass: string) {
    return this.httpServ.post<Usuario>(
      'api/usuario/login',
      { user, pass }
    );
  }

  public logout() {
    return this.httpServ.get<void>(
      'api/usuario/logout'
    );
  }

  public getSession() {
    return this.httpServ.get<CheckSession>(
      'api/usuario/get/session'
    );
  }

  public getAll() {
    return this.httpServ.get<Usuario[]>(
      'api/usuario/get'
    );
  }

  public update(user: Usuario) {
    return this.httpServ.patch<void>(
      `api/usuario/set`,
      user
    );
  }

  public disable(id: number) {
    return this.httpServ.delete<void>(
      `api/usuario/disable/${id}`
    );
  }
}
