import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Printer } from 'src/app/models/printer';

export { Printer };

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
  constructor(
    private httpServ: HttpService
  ) { }

  getAll() {
    return this.httpServ.get<Printer[]>(
      'api/printer/get'
    );
  }

  getByFormatoId(id: number) {
    return this.httpServ.get<Printer[]>(
      `api/formato/get/${id}/printers`
    );
  }

  setByFormatoId(id: number, data: Printer[]) {
    return this.httpServ.post<void>(
      `api/formato/set/${id}/printers`,
      data,
    );
  }
}
