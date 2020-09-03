import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { UsuarioTipo } from './usuario-tipo';
import { Usuario } from "./usuario";

@Entity({ name: 'UsuarioQueue' })
export class UsuarioQueue extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 20 })
  user: string;

  @Column({ type: 'varchar', length: 256 })
  mail: string;

  @Column({ type: 'varchar', length: 256 })
  token: string;

  @ManyToOne(type => Usuario, obj => obj.usuarioQueue, { nullable: true })
  creator: Usuario;

  @ManyToOne(type => UsuarioTipo, obj => obj.id, { eager: true })
  usuarioTipo: UsuarioTipo;
}