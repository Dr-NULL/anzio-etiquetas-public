import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';

export interface IModalBtn {
  faicon?: string;
  text?: string;
  type?: 'primary' | 'secondary' | 'success' | 'danger';
  dissmiss?: boolean;
  callback?: () => void | Promise<void>;
}

@Component({
  selector: 'app-modal-gen',
  templateUrl: './modal-gen.component.html',
  styleUrls: ['./modal-gen.component.scss']
})
export class ModalGenComponent implements OnInit {
  type: 'info' | 'success' | 'danger';
  html: string;
  btns: IModalBtn[];

  constructor(
    private selfServ: NzModalRef
  ) { }

  ngOnInit(): void {
  }

  onClick(btn: IModalBtn) {
    if (btn.callback != null) {
      btn.callback();
    }

    if (btn.dissmiss !== false) {
      this.selfServ.destroy();
    }
  }
}
