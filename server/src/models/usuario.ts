import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UsuarioTipo } from './usuario-tipo';
import { UsuarioQueue } from './usuario-queue';

@Entity({ name: 'Usuario' })
export class Usuario extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'bit', default: 1 })
    isActive: boolean;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({ type: 'varchar', length: 12 })
    rut: string;
    
    @Column({ type: 'varchar', length: 100 })
    nombres: string;
    
    @Column({ type: 'varchar', length: 100 })
    apellidoP: string;
    
    @Column({ type: 'varchar', length: 100, nullable: true })
    apellidoM: string;
    
    @Column({ type: 'varchar', length: 20 })
    user: string;
    
    @Column({ type: 'varchar', length: 1024 })
    pass: string;
    
    @Column({ type: 'varchar', length: 100 })
    mail: string;

    @ManyToOne(type => UsuarioTipo, TipoUsuario => TipoUsuario.id, { eager: true })
    usuarioTipo: UsuarioTipo;

    @OneToMany(type => UsuarioQueue, obj => obj.creator)
    usuarioQueue: UsuarioQueue[];
}