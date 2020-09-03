import { Component, OnInit, Renderer2 } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { UsuarioTipo } from 'src/app/models';

import { ModalGenService } from '../../shared/modal-gen/modal-gen.service';
import { UsuarioTipoService } from 'src/app/services/usuario-tipo/usuario-tipo.service';
import { NzMessageService } from 'ng-zorro-antd';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { regEmail } from 'src/app/utils/regex-prebuilt';

@Component({
  selector: 'app-usuario-crud-add',
  templateUrl: './usuario-crud-add.component.html',
  styleUrls: ['./usuario-crud-add.component.scss']
})
export class UsuarioCrudAddComponent implements OnInit {
  types: UsuarioTipo[];
  type: UsuarioTipo;
  user = '';
  mail = '';

  isUserValid = false;
  isMailValid = false;
  isWaiting = false;
  isAlive = true;

  constructor(
    private render: Renderer2,
    private refSelf: NzModalRef,
    private msgServ: NzMessageService,
    private userServ: UsuarioService,
    private typeServ: UsuarioTipoService,
    private mdlGenServ: ModalGenService,
  ) { }

  async ngOnInit() {
    try {
      const resp = await this.typeServ.getAll();
      this.types = resp.data;

      const i = this.types.length - 1;
      this.type = this.types[i];
    } catch (err) {
      this.refSelf.close();
      this.mdlGenServ.danger(
        'Error!',
        (err.details) ? err.details : err.message
      );
    }
  }

  dismiss() {
    this.refSelf.destroy();
    this.isAlive = false;
  }

  inputUser(elem: HTMLInputElement) {
    this.user = elem.value
      .replace(/[^a-z0-9\.\-_]/gi, '')
      .toLowerCase()
      .trim();

    elem.value = this.user;
    this.isUserValid = this.user.length >= 4;
    if (this.isUserValid) {
      this.render.removeClass(
        elem, 'error'
      );
    }
  }

  inputMail(elem: HTMLInputElement) {
    this.mail = elem.value
      .replace(/[^a-z0-9\.\-_@]/gi, '')
      .toLowerCase()
      .trim();

    elem.value = this.mail;
    const reg = regEmail(true);

    this.isMailValid = reg.matchIn(this.mail).length > 0;
    if (this.isMailValid) {
      this.render.removeClass(
        elem, 'error'
      );
    }
  }

  async blurUser(elem: HTMLInputElement) {
    if (!this.isUserValid) {
      this.render.addClass(
        elem, 'error'
      );

      await this.sleep(250);
      if (this.isAlive) {
        this.msgServ.error(
          'El campo "Nombre Usuario" debe contener '
          + 'al menos 4 caracteres de largo.'
        );
      }
    }

    console.log(this.refSelf.getInstance());
  }

  async blurMail(elem: HTMLInputElement) {
    if (!this.isMailValid) {
      this.render.addClass(
        elem, 'error'
      );

      await this.sleep(250);
      if (this.isAlive) {
        this.msgServ.error(
          'El campo "E-Mail" es inválido.'
        );
      }
    }
  }

  async create() {
    // Prevent resend
    if (this.isWaiting) {
      return;
    } else {
      this.isWaiting = true;
    }

    try {
      await this.userServ.addQueue(
        this.user,
        this.mail,
        this.type.id
      );

      this.msgServ.success(
        'El usuario se ha añadido a la lista de confirmación.'
      );
      this.refSelf.destroy();
    } catch (err) {
      this.user = '';
      this.mail = '';
      this.isUserValid = false;
      this.isMailValid = false;
      this.mdlGenServ.danger(
        'Error!',
        (err.details) ? err.details : err.message
      );
    } finally {
      this.isWaiting = false;
    }
  }

  private sleep(ms: number) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }
}
