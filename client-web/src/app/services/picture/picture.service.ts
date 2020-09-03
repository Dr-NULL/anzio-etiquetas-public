import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Picture } from 'src/app/models/picture';

@Injectable({
  providedIn: 'root'
})
export class PictureService {

  constructor(
    private httpServ: HttpService
  ) { }

  get(id?: number) {
    const data = (id == null) ? '' : '' + id;
    return this.httpServ.get<Picture[]>(`/api/picture/get/${data}`);
  }

  sendPicture(file: File) {
    return this.httpServ.file<void>('/api/picture/add', file);
  }
}
