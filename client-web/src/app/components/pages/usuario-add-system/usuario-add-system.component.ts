import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { regEmail } from 'src/app/utils/regex-prebuilt';

import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { ModalGenService } from '../../shared/modal-gen/modal-gen.service';

@Component({
  selector: 'app-usuario-system',
  templateUrl: './usuario-add-system.component.html',
  styleUrls: ['./usuario-add-system.component.scss']
})
export class UsuarioAddSystemComponent implements OnInit {
  isValid = false;
  user = '';
  mail = '';

  constructor(
    private router: Router,
    private msgServ: NzMessageService,
    private userServ: UsuarioService,
    private modalGenServ: ModalGenService
  ) { }

  async ngOnInit() {
    try {
      const resp = await this.userServ.checkSystemUser();
      if (resp.data.exists) {
        this.router.navigate([ '/' ]);
      }
    } catch (err) {
      this.onError(err);
    }
  }

  check() {
    const reg = regEmail(true);
    this.isValid = (
      (this.user.trim().length >= 4) &&
      (reg.matchIn(this.mail).length > 0)
    );
  }

  onInputUser(input: HTMLInputElement) {
    input.value = input.value
      .replace(/[^a-z0-9\.\-_]/gi, '')
      .toLowerCase()
      .trim();
    this.user = input.value;
    this.check();
  }

  onInputMail(input: HTMLInputElement) {
    input.value = input.value
      .replace(/[^a-z0-9\.\-_@]/gi, '')
      .toLowerCase()
      .trim();

    this.mail = input.value;
    this.check();
  }

  onError(err: any) {
    this.modalGenServ.danger(
      'Error!',
      (err.details) ? err.details : err.message,
      {
        type: 'primary',
        text: 'Aceptar',
        faicon: 'far fa-thumbs-up',
        dissmiss: true,
        callback: () => {
          this.router.navigate([ '/' ]);
        }
      }
    );
  }

  async onSave() {
    try {
      this.isValid = false;
      await this.userServ.addQueueSystem(
        this.user,
        this.mail
      );

      this.msgServ.success('Usuario System creado correctamente!');
      this.router.navigate([ '/' ]);
    } catch (err) {
      this.onError(err);
      this.user = '';
      this.mail = '';
    }
  }
}
