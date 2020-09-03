import { BaseEntity, Entity, Tree, Column, PrimaryGeneratedColumn, TreeChildren, OneToMany, TreeParent, getManager } from 'typeorm';
import { UsuarioTipoMenu } from './usuario-tipo-menu';
import { UsuarioTipo } from './usuario-tipo';
import { Usuario } from './usuario';

import { Request } from 'express';

@Entity({ name: 'Menu' })
@Tree('materialized-path')
export class Menu extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'bit', default: 0 })
  everyone: boolean;

  @Column({ type: 'bit', default: 0 })
  hidden: boolean;

  @Column({ type: 'bit', default: 0 })
  hideOnLogged: boolean;

  @Column({ type: 'varchar', length: 50 })
  icon: string;

  @Column({ type: 'varchar', length: 100 })
  text: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  path: string;

  @OneToMany(target => UsuarioTipoMenu, target => target.id)
  usuarioTipoMenu: UsuarioTipoMenu[];

  @TreeChildren()
  children: Menu[];

  @TreeParent()
  parent: Menu;

  public async saveForTypes(...userTypes: UsuarioTipo[]) {
    await this.save()

    if (userTypes.length == 0) {
      userTypes = await UsuarioTipo.find()
    }

    for (const userType of userTypes) {
      const relat = new UsuarioTipoMenu()
      relat.usuarioTipo = userType
      relat.menu = this
      await relat.save()
    }
  }

  public static async getByType(type: UsuarioTipo = null) {
    // Get full menu
    const manag = getManager()
    const three = manag.getTreeRepository(Menu)
    const menus = await three.findTrees()

    if (!type) {
      const check = (menu: Menu) => {
        // Chech sons
        if (menu.children.length > 0) {
          menu.children = menu.children.filter(check)
        }

        return menu.everyone
      }
      
      return menus.filter(check)
    } else {
      // Get relations
      const relat: { id: number }[] = await UsuarioTipoMenu
        .createQueryBuilder('relat')
        .select([ 'relat.menuId as id' ])
        .where('relat.usuarioTipoId = :id', { id: type.id })
        .distinct()
        .execute()
  
      // Recursive filter
      const check = (menu: Menu) => {
        // Check id
        let found = false
        if (relat.find(x => x.id === menu.id)) {
          found = true
        }
  
        // Check sons
        if (
          (found) &&
          (menu.children.length > 0)
        ) {
          menu.children = menu.children.filter(check)
        }
  
        return found
      }
  
      //filter All
      return menus.filter(check)
    }
  }

  public static async isPageAvailable(req: Request) {
    // Clean URL
    let url = req.headers.origin + '/'
    if (req.headers.referer) {
      url = req.headers.referer.replace(url, '')
    }

    // Get user's menu
    let found = false
    let menu: Menu[]
    if (req.session.current) {
      const user: Usuario = req.session.current.getData()
      const type = user.usuarioTipo
      menu = await Menu.getByType(type)
    } else {
      menu = await Menu.getByType()
    }

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
        if (url.match(reg)) {
          found = true;
        }
      }
    }

    for (const item of menu) {
      check(item)
      if (found) {
        break
      }
    }

    return found
  }

  public getUserMenu(user: Usuario) {

  }
}