import { Injectable } from '@angular/core';
import { NzModalService, NzModalComponent } from 'ng-zorro-antd/modal';
import { ModalLoadingComponent } from './modal-loading.component';

@Injectable({
  providedIn: 'root'
})
export class ModalLoadingService {
  private self: NzModalComponent<any, any>;

  constructor(
    private modalServ: NzModalService
  ) { }

  show(title: string = 'Cargando', message: string = 'Espere por favor...') {
    if (this.self != null) {
      this.hide();
      this.self.destroy();
      this.self = null;
    }

    this.self = this.modalServ.create({
      nzContent: ModalLoadingComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzFooter: null,
      nzComponentParams: {
        title,
        message
      }
    }).getInstance();
  }

  hide() {
    if (this.self != null) {
      this.self.close();
    }
  }
}
