import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, RouterOutlet } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { SideMenuItemComponent } from '../side-menu-item/side-menu-item.component';
import { fadeAnime } from 'src/app/utils/fade-anime';
import { clone } from 'src/app/utils/clone';
import { Menu } from 'src/app/models';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  animations: [ fadeAnime ]
})
export class SideMenuComponent implements OnInit, OnDestroy {
  get expanded(): boolean {
    return SideMenuItemComponent.expanded;
  }
  set expanded(v: boolean) {
    SideMenuItemComponent.expanded = v;
  }

  routerSub: Subscription;
  menu: Menu[] = [];
  link: Menu[] = [];


  constructor(
    private router: Router,
    private msgServ: NzMessageService,
    private userServ: UsuarioService,
  ) { }

  ngOnInit(): void {
    // Listen Route Changes
    this.routerSub = this
      .router.events
      .subscribe((e: any) => {
        if (e.routerEvent) {
          this.checkRoute.bind(this)();
        }
      });
  }

  ngOnDestroy() {
    // Kill Listeners
    this.routerSub.unsubscribe();
  }

  checkMenu(menu: Menu) {
    if (menu.children.length > 0) {
      menu.children = menu.children.filter(this.checkMenu);
    }
    return !menu.hidden;
  }

  async checkRoute() {
    try {
      const resp = await this.userServ.getSession();
      this.menu = clone(resp.data.menu).filter(this.checkMenu.bind(this));
      this.link = clone(resp.data.menu);
      this.checkPath();
    } catch (err) {
      this.msgServ.error(
        (err.details) ? err.details : err.message
      );
    }
  }

  public getRouterOutletState(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  checkPath() {
    let found = false;
    let curr = location.href
      .replace(location.origin + '/', '');
    if (!curr.match(/\/+$/gi)) {
      curr += '/';
    }

    // Check if has permission
    const check = (x: Menu) => {
      // Recursive
      for (const y of x.children) {
        check(y);
        if (found) {
          return;
        }
      }

      if (x.path) {
        // Build Pattern
        const patt = x.path
          .replace(/\/:[0-9a-z-_]+\?/gi, '\/([^//]+)?')
          .replace(/\/:[0-9a-z-_]+/gi, '\/[^//]+')
          .replace(/(^\/|\/$)/gi, '');

        // Compare
        const reg = new RegExp(patt, 'gi');
        if (curr.match(reg)) {
          found = true;
        }
      }
    };

    for (const item of this.link) {
      check(item);
      if (found) {
        break;
      }
    }

    if (!found) {
      this.msgServ.error('Página no encontrada');
      this.router.navigate([ '/' ]);
    }
  }
}
