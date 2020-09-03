import { Component, OnInit, OnDestroy, Input, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ModalGenService } from 'src/app/components/shared/modal-gen/modal-gen.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { Menu } from 'src/app/models/menu';
import { SideMenuComponent } from '../side-menu/side-menu.component';

@Component({
  selector: 'app-side-menu-item',
  templateUrl: './side-menu-item.component.html',
  styleUrls: ['./side-menu-item.component.scss']
})
export class SideMenuItemComponent implements OnInit, OnDestroy {
  private static inst: SideMenuItemComponent[] = [];
  private get inst() {
    return SideMenuItemComponent.inst;
  }

  private static privExpanded = false;
  public static get expanded(): boolean {
    return SideMenuItemComponent.privExpanded;
  }
  public static set expanded(v: boolean) {
    SideMenuItemComponent.privExpanded = v;
    SideMenuItemComponent.inst.forEach(x => {
      x.open = false;
    });
  }
  get expanded(): boolean {
    return SideMenuItemComponent.privExpanded;
  }
  set expanded(v: boolean) {
    SideMenuItemComponent.privExpanded = v;
  }

  @Input()
  model: Menu;

  @Input()
  open = false;

  constructor(
    private router: Router,
    private msgServ: NzMessageService,
    private refSelf: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private userServ: UsuarioService,
    private mdlGenServ: ModalGenService,
  ) { }

  ngOnInit(): void {
    this.inst.push(this);
    this.renderer.addClass(
      this.refSelf.nativeElement,
      'no-select'
    );
  }

  ngOnDestroy() {
    const i = this.inst
      .findIndex(x => {
        return x.model.id === this.model.id;
      });

    this.inst.splice(i, 1);
  }

  @HostListener('click', [])
  click() {
    if (this.model.path) {
      // Go to the Path
      this.router.navigate([ this.model.path ]);
      setTimeout(() => {
        this.expanded = false;
      }, 100);

    } else if (this.model.icon.match(/fa-sign-out/)) {
      // Logout
      this.logout();
      setTimeout(() => {
        this.expanded = false;
      }, 100);

    } else if (this.model.children.length > 0) {
      // Open the list
      this.expanded = true;
      this.openList();
    }
  }

  async logout() {
    try {
      await this.userServ.logout();
      this.msgServ.success('Sessión cerrada correctamente!');
    } catch (err) {
      this.mdlGenServ.danger(
        'Error!',
        (err.details) ? err.details : err.message
      );
    } finally {
      this.router.navigate([ '/' ]);
    }
  }

  openList() {
    // Search the correct path
    const search = (x: Menu) => {
      if (x.id === this.model.id) {
        // Current element
        return true;
      } else {
        // Recursive search
        for (const y of x.children) {
          if (search(y)) {
            return true;
          }
        }
        return false;
      }
    };

    // Find all coincidences
    const yes: SideMenuItemComponent[] = [];
    const not: SideMenuItemComponent[] = [];
    for (const x of this.inst) {
      if (search(x.model)) {
        yes.push(x);
      }
    }

    // Apply selection
    not.forEach(x => x.open = false);
    for (const x of yes) {
      x.open = !this.open;
    }
  }
}
