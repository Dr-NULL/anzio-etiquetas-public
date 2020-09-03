import { Injectable } from '@angular/core';
import { NzModalService, NzModalComponent } from 'ng-zorro-antd/modal';
import { ModalGenComponent, IModalBtn } from './modal-gen.component';

@Injectable({
  providedIn: 'root'
})
export class ModalGenService {
  private self: NzModalComponent<any, any>;

  constructor(
    private modalServ: NzModalService
  ) { }

  private show(
    type: 'info' | 'success' | 'danger',
    title: string,
    html: string,
    ...btns: IModalBtn[]
  ) {
    // Botón por defecto
    if (btns.length === 0) {
      btns.push({
        faicon: 'far fa-thumbs-up',
        text: 'Aceptar',
        dissmiss: true
      });
    }

    if (this.self != null) {
      this.self.destroy();
      this.self = null;
    }

    this.self = this.modalServ.create({
      nzContent: ModalGenComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzFooter: null,
      nzTitle: title,
      nzComponentParams: {
        type,
        html,
        btns
      }
    }).getInstance();
  }

  hide() {
    if (this.self != null) {
      this.self.destroy();
      this.self = null;
    }
  }

  info(title: string, html: string, ...btns: IModalBtn[]) {
    this.show('info', title, html, ...btns);
  }

  success(title: string, html: string, ...btns: IModalBtn[]) {
    this.show('success', title, html, ...btns);
  }

  danger(title: string, html: string, ...btns: IModalBtn[]) {
    this.show('danger', title, html, ...btns);
  }
}
