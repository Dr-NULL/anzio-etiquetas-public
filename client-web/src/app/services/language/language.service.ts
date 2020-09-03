import { Injectable } from '@angular/core';
import { HttpService, Http } from '../http/http.service';

import { Language } from 'src/app/models/language';
export { Language };

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(
    private httpServ: HttpService
  ) { }

  async getAll() {
    return this.httpServ.get<Language[]>(
      '/api/language/get'
    );
  }

  async add(data: Language) {
    return this.httpServ.post<Language>(
      '/api/language/add/',
      data
    );
  }

  async set(data: Language) {
    return this.httpServ.post<Language>(
      '/api/language/set/',
      data
    );
  }

  async delete(id: number) {
    return this.httpServ.get<void>(
      `/api/language/del/${id}`
    );
  }
}
