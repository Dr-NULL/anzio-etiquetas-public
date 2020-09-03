import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';

import { ModalGenService } from 'src/app/components/shared/modal-gen/modal-gen.service';
import { UsuarioService, Usuario } from 'src/app/services/usuario/usuario.service';
import { Rut } from 'src/app/utils/rut';

@Component({
  selector: 'app-usuario-add',
  templateUrl: './usuario-add.component.html',
  styleUrls: ['./usuario-add.component.scss']
})
export class UsuarioAddComponent implements OnInit, OnDestroy {
  subsRouter: Subscription;
  token: string;

  isWaiting = false;
  okRut = true;
  okFName = true;
  okLName = true;
  okPass1 = true;
  okPass2 = true;

  // Variables de Usuario
  type: string;
  user: string;
  mail: string;
  pass01: string;
  pass02: string;

  rut = '';
  fName = '';
  lNameP = '';
  lNameM = '';

  constructor(
    private router: Router,
    private msgServ: NzMessageService,
    private userServ: UsuarioService,
    private mdlGenServ: ModalGenService,
    private activeRouter: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subsRouter = this.activeRouter
      .paramMap
      .subscribe(this.onActiveRoute.bind(this));
  }

  ngOnDestroy() {
    this.subsRouter.unsubscribe();
  }

  onFail(err: any) {
    this.mdlGenServ.danger(
      'Error!',
      (err.details) ? err.details : err.message,
      {
        type: 'primary',
        text: 'Aceptar',
        faicon: 'far fa-thumbs-up',
        callback: () => {
          this.router.navigate([ '/' ]);
        }
      }
    );
  }

  async onActiveRoute(body: any) {
    try {
      this.token = body.params.token;
      const resp = await this.userServ.getQueue(this.token);

      this.type = resp.data.usuarioTipo.nombre;
      this.user = resp.data.user;
      this.mail = resp.data.mail;

      this.okRut = true;
      this.okFName = true;
      this.okLName = true;
      this.okPass1 = true;
      this.okPass2 = true;

      this.fName = '';
      this.lNameP = '';
      this.lNameM = '';
      this.pass01 = '';
      this.pass02 = '';

    } catch (err) {
      this.msgServ.error(err.details);
      this.router.navigate([ '/' ]);
    }
  }

  onInputRut(input: HTMLInputElement) {
    input.value = Rut.format(input.value);
    this.rut = input.value;
    this.okRut = Rut.isValid(input.value);
  }

  onInputFName(input: HTMLInputElement) {
    input.value = input.value
      .replace(/[^a-zÀ-ÖØ-öø-ʔʕ-ʯ0-9\s']/gi, '')
      .replace(/\s+/gi, ' ');

    this.fName = input.value;
    this.okFName = this.fName.length > 0;
  }

  onInputLNameP(input: HTMLInputElement) {
    input.value = input.value
      .replace(/[^a-zÀ-ÖØ-öø-ʔʕ-ʯ0-9\s']/gi, '')
      .replace(/\s+/gi, ' ');

    this.lNameP = input.value;
    this.okLName = this.lNameP.length > 0;
  }

  onInputLNameM(input: HTMLInputElement) {
    input.value = input.value
      .replace(/[^a-zÀ-ÖØ-öø-ʔʕ-ʯ0-9\s']/gi, '')
      .replace(/\s+/gi, ' ');

    this.lNameM = input.value;
  }

  onInputPass01(input: HTMLInputElement) {
    input.value = input.value
      .replace(/[\s]/gi, '');

    this.pass01 = input.value;
    this.okPass1 = this.pass01.length >= 8;
  }

  onInputPass02(input: HTMLInputElement) {
    input.value = input.value
      .replace(/[\s]/gi, '');

    this.pass02 = input.value;
    this.okPass2 = this.pass02 === this.pass01;
  }

  onBlur(input: HTMLInputElement) {
    input.value = input.value.trim();
  }

  isDone() {
    return (
      (Rut.isValid(this.rut)) &&
      (this.fName.length > 0) &&
      (this.lNameP.length > 0) &&
      (this.pass01.length >= 8) &&
      (this.pass01 === this.pass02)
    );
  }

  async onSave() {
    if (!this.isWaiting) {
      this.isWaiting = true;
    } else {
      return;
    }

    const user = new Usuario();
    user.rut = this.rut;
    user.nombres = this.fName;
    user.apellidoP = this.lNameP;
    user.apellidoM = this.lNameM;
    user.pass = this.pass02;

    try {
      await this.userServ.addUser(user, this.token);
      this.mdlGenServ.success(
        'Completado!',
        'Su cuenta se ha creado correctamente. Ahora puede iniciar sesión con su nombre de usuario y su contraseña.'
      );
      this.router.navigate([ '/' ]);
    } catch (err) {
      this.mdlGenServ.danger(
        'Error!',
        (err.details) ? err.details : err.message
      );

      // RUT ya registrado
      if (err.status === 409) {
        this.rut = '';
      }
    } finally {
      this.isWaiting = false;
      this.pass01 = '';
      this.pass02 = '';
    }
  }
}
