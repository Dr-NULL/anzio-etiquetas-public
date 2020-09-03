import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { PictureService } from 'src/app/services/picture/picture.service';
import { Picture } from 'src/app/models/picture';
import { Http } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-picture-picker',
  templateUrl: './picture-picker.component.html',
  styleUrls: ['./picture-picker.component.scss']
})
export class PicturePickerComponent implements OnInit {
  files: File[] = [];
  picts: Picture[] = [];

  @Output()
  modelChange = new EventEmitter<Picture>();
  @Input()
  model: Picture;

  constructor(
    private pictServ: PictureService,
    private msgServ: NzMessageService,
    private modalRef: NzModalRef
  ) { }

  async ngOnInit() {
    try {
      const res = await this.pictServ.get();
      this.picts = res.data;
    } catch (err) {
      console.log(err);
      this.msgServ.error(err.details);
    }
  }

  onClear() {
    this.files = [];
  }

  async onUpload() {
    try {
      const todo: Promise<Http<void>>[] = [];
      while (this.files.length > 0) {
        todo.push(this.pictServ.sendPicture(this.files[0]));
        this.files.splice(0, 1);
      }

      await Promise.all(todo);
      this.msgServ.success('Los archivos se han enviado correctamente.');
    } catch (err) {
      console.log(err);
      this.msgServ.error(err.details);
    } finally {
      this.ngOnInit();
    }
  }

  onClick(img: Picture) {
    this.model = img;
    this.modelChange.emit(img);
    this.modalRef.close();
  }

  onClose() {
    this.modalRef.close();
  }
}
