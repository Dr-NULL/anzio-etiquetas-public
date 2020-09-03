import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity({ name: 'Pais' })
export class Pais extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'bit', default: 1 })
    isActive: boolean;
    
    @Column({ type: 'varchar', length: 3 })
    codigo: string;
    
    @Column({ type: 'varchar', length: 50 })
    descripc: string;
}