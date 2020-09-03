import { Component, OnInit } from '@angular/core';
import { UsuarioService, Usuario, UsuarioTipo } from 'src/app/services/usuario/usuario.service';
import { ModalGenService } from '../../shared/modal-gen/modal-gen.service';
import { NzModalService } from 'ng-zorro-antd/modal';

import { UsuarioCrudAddComponent } from '../usuario-crud-add/usuario-crud-add.component';
import { UsuarioCrudQueueComponent } from '../usuario-crud-queue/usuario-crud-queue.component';
import { UsuarioTipoService } from 'src/app/services/usuario-tipo/usuario-tipo.service';
import { NzMessageService } from 'ng-zorro-antd';
import { regEmail } from 'src/app/utils/regex-prebuilt';
import { Rut } from 'src/app/utils/rut';
import { clone } from 'src/app/utils/clone';

@Component({
  selector: 'app-usuario-crud',
  templateUrl: './usuario-crud.component.html',
  styleUrls: ['./usuario-crud.component.scss']
})
export class UsuarioCrudComponent implements OnInit {
  types: UsuarioTipo[] = [];
  users: Usuario[];
  usersFilter: Usuario[];

  userEdit: Usuario;

  constructor(
    private mdlServ: NzModalService,
    private msgServ: NzMessageService,
    private userServ: UsuarioService,
    private typeServ: UsuarioTipoService,
    private mdlGenServ: ModalGenService
  ) { }

  async ngOnInit() {
    this.userServ
      .getAll()
      .catch(this.error.bind(this))
      .then(res => {
        this.users = res.data;
      });

    this.typeServ
      .getAll()
      .catch(this.error.bind(this))
      .then(res => {
        this.types = res.data;
      });
  }

  error(err: any) {
    this.mdlGenServ.danger(
      'Error!',
      (err.details) ? err.details : err.message
    );
  }

  filterUsers(data: Usuario[]) {
    this.usersFilter = [ ...data ];
  }

  createUser() {
    this.mdlServ.create({
      nzTitle: 'Crear Nuevo Usuario',
      nzContent: UsuarioCrudAddComponent,
      nzWidth: '40rem',
      nzClosable: false,
      nzMaskClosable: false
    });
  }

  viewQueue() {
    this.mdlServ.create({
      nzTitle: 'Crear Nuevo Usuario',
      nzContent: UsuarioCrudQueueComponent,
      nzWidth: 'calc(100vw - 20rem)',
      nzClosable: false,
      nzMaskClosable: true
    });
  }

  isEditing(user: Usuario) {
    if (!this.userEdit) {
      return false;
    } else {
      return this.userEdit.id === user.id;
    }
  }

  edit(user: Usuario) {
    this.userEdit = clone(user);
  }

  inputEmail(input: HTMLInputElement) {
    const v = input.value
      .replace(/[^0-9a-z@\-_\.]/gi, '')
      .substr(0, 100);

    this.userEdit.mail = v;
    input.value = v;
  }

  inputNick(input: HTMLInputElement) {
    const v = input.value
      .replace(/[^0-9a-z\-_\.]/gi, '')
      .substr(0, 20);

    this.userEdit.user = v;
    input.value = v;
  }

  inputRut(input: HTMLInputElement) {
    const v = input.value
      .replace(/[^0-9\.-k]/gi, '')
      .substr(0, 12);

    this.userEdit.rut = Rut.format(v);
    input.value = this.userEdit.rut;
  }

  inputName(input: HTMLInputElement) {
    const v = input.value
      .replace(/\s+/gi, ' ')
      .replace(/[^'0-9a-z\-_\.\s]/gi, '')
      .substr(0, 100);

    this.userEdit.nombres = v;
    input.value = v;
  }

  inputApellidoP(input: HTMLInputElement) {
    const v = input.value
      .replace(/\s+/gi, ' ')
      .replace(/[^'0-9a-z\-_\.\s]/gi, '')
      .substr(0, 100);

    this.userEdit.apellidoP = v;
    input.value = v;
  }

  inputApellidoM(input: HTMLInputElement) {
    const v = input.value
      .replace(/\s+/gi, ' ')
      .replace(/[^'0-9a-z\-_\.\s]/gi, '')
      .substr(0, 100);

    this.userEdit.apellidoM = v;
    input.value = v;
  }

  blurTrim(e: FocusEvent) {
    const target = (e.currentTarget as HTMLInputElement);
    target.value = target.value.trim();
  }

  isValid() {
    return (
      (this.userEdit.mail.length >= 5)      &&
      (this.userEdit.user.length >= 4)      &&
      (Rut.isValid(this.userEdit.rut))      &&
      (this.userEdit.nombres.length >= 2)   &&
      (this.userEdit.apellidoP.length >= 2)
    );
  }

  async save() {
    try {
      await this.userServ.update(this.userEdit);
      this.msgServ.success('Cambios guardados correctamente.');

      this.users = [ ...this.users.map(x => {
        if (x.id === this.userEdit.id) {
          return clone(this.userEdit);
        } else {
          return x;
        }
      }) ];
    } catch (err) {
      this.error(err);
    } finally {
      this.userEdit = undefined;
    }
  }

  async disable(user: Usuario) {
    try {
      await this.userServ.disable(user.id);
      this.msgServ.success(`Usuario "${user.user}" desactivado correctamente.`);

      this.users = [ ...this.users.filter(x => x.id !== user.id) ];
    } catch (err) {
      this.error(err);
    }
  }
}
