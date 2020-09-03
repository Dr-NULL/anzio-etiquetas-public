import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalGenService } from 'src/app/components/shared/modal-gen/modal-gen.service';
import { UsuarioService, Usuario } from 'src/app/services/usuario/usuario.service';
import { Subscription } from 'rxjs';

import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user-login',
  templateUrl: './usuario-login.component.html',
  styleUrls: ['./usuario-login.component.scss']
})
export class UsuarioLoginComponent implements OnInit, OnDestroy {
  obsRouter: Subscription;
  user = '';
  pass = '';

  okUser = false;
  okPass = false;

  constructor(
    private router: Router,
    private msgServ: NzMessageService,
    private userServ: UsuarioService,
    private modalGenServ: ModalGenService,
    private activeRouter: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.obsRouter = this.activeRouter.paramMap.subscribe(this.onEnterForm.bind(this));
  }

  ngOnDestroy() {
    this.obsRouter.unsubscribe();
  }

  async onEnterForm() {
    try {
      const resp = await this.userServ.checkSystemUser();
      if (!resp.data.exists) {
        this.router.navigate([ '/usuario/system' ]);
      }
    } catch (err) {
      this.onFail(err);
    }
  }

  onFail(err: any) {
    this.modalGenServ.danger(
      'ERROR!',
      (err.details) ? err.details : err.message,
      {
        type: 'primary',
        text: 'Aceptar',
        faicon: 'far fa-thumbs-up',
        dissmiss: true
      }
    );
  }

  onInputUser(input: HTMLInputElement) {
    input.value = input.value
      .replace(/[^a-z0-9\.\-_]/gi, '')
      .toLowerCase()
      .trim();

    this.user = input.value;
    this.okUser = this.user.length >= 4;
  }

  onInputPass(input: HTMLInputElement) {
    input.value = input.value
      .replace(/[\s]/gi, '');

    this.pass = input.value;
    this.okPass = this.pass.length >= 8;
  }

  isValid() {
    return (
      (this.okUser) &&
      (this.okPass)
    );
  }

  async onLogin() {
    try {
      const resp = await this.userServ.login(
        this.user,
        this.pass
      );

      // Make number
      let name = resp.data.nombres + ' ';
      name += resp.data.apellidoP;
      if (resp.data.apellidoM) {
        name += ' ' + resp.data.apellidoM;
      }

      // Make message
      this.router.navigate([ '/' ]);
      this.msgServ.success(`Bienvenido ${name}!`);
    } catch (err) {
      this.modalGenServ.danger(
        'Error:',
        (err.details) ? err.details : err.message
      );

      this.user = '';
      this.pass = '';
    }
  }
}
