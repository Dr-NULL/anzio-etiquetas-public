import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { ModalGenService } from 'src/app/components/shared/modal-gen/modal-gen.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'client-web';
  minWidth = '80px';
  maxWidth = '256px';
  isCollapsed = true;
  isLogged = false;
  routerSub: Subscription;

  constructor(
    private router: Router,
    private userServ: UsuarioService,
    private msgServ: NzMessageService,
    private mdlGenServ: ModalGenService
  ) {}

  ngOnInit() {
    this.routerSub = this.router.events.subscribe(
      this.onRouteChange.bind(this)
    );
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }

  deselect() {
    setTimeout(() => {
      document
        .querySelectorAll('.ant-menu-item-selected')
        .forEach((item: HTMLElement) => {
          item.classList.remove('ant-menu-item-selected');
        });
    }, 500);
  }

  async logout() {
    try {
      await this.userServ.logout();
      this.msgServ.success('Sesión cerrada con éxito!');
      this.router.navigate([ '/' ]);
    } catch (err) {
      this.mdlGenServ.danger(
        'Error!',
        (err.details) ? err.details : err.message
      );
    }
  }

  async onRouteChange(event: any) {
    // En caso de que la ruta no cambie...
    if (!event.routerEvent) {
      return;
    }

    // Reviso si el usuario está logeado
    try {
      const resp = await this.userServ.getSession();
      this.isLogged = (resp.data) ? true : false;
    } catch (err) {
      this.isLogged = false;
    }
  }
}
