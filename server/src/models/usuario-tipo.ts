import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './usuario';

@Entity({ name: 'UsuarioTipo' })
export class UsuarioTipo extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'tinyint' })
    rango: number;
    
    @Column({ type: 'varchar' })
    nombre: string;
    
    @Column({ type: 'varchar' })
    descripc: string;

    @OneToMany(type => Usuario, Usuario => Usuario.usuarioTipo)
    usuario: Promise<Usuario[]>;
}