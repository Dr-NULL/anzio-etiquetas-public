import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Formato } from './formato';

@Entity({ name: 'FormatoRect' })
export class FormatoRect extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;
    
    @Column({ type: 'float' })
    x: number;
    
    @Column({ type: 'float' })
    y: number;
    
    @Column({ type: 'float' })
    width: number;
    
    @Column({ type: 'float' })
    height: number;
    
    @Column({ type: 'float', default: 0.5 })
    lineWidth: number;
    
    @Column({ type: 'float', default: 0 })
    cornerRadius: number;

    @Column({ type: 'varchar', length: 7, default: '#000000' })
    color: string;

    @ManyToOne(type => Formato, Formato => Formato.formatoRect)
    formato: Formato;
}