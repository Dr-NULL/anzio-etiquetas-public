import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UsuarioTipo } from './usuario-tipo';
import { Menu } from './menu';

@Entity({ name: 'UsuarioTipoMenu' })
export class UsuarioTipoMenu extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ManyToOne(target => UsuarioTipo, target => target.id)
  usuarioTipo: UsuarioTipo;

  @ManyToOne(target => Menu, target => target.id)
  menu: Menu;
}