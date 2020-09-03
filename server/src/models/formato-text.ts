import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Formato } from './formato';
import { Fuente } from './fuente';

@Entity({ name: 'FormatoText' })
export class FormatoText extends BaseEntity {
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

    @Column({ type: 'float', default: 0 })
    angle: number;
    
    @Column({ type: 'nvarchar', length: 1024 })
    text: string;
    
    @Column({ type: 'varchar', default: 'left' })
    align: 'left' | 'right' | 'center' | 'justify';

    @Column({ type: 'varchar', default: 'top', length: 50 })
    baseline: 'svg-middle' | 'middle' | 'svg-central' | 'bottom' | 'ideographic' | 'alphabetic' | 'mathematical' | 'hanging' | 'top';

    @Column({ type: 'float', default: 10 })
    fontSize: number;

    @Column({ type: 'bit', default: true })
    printOriginal: boolean;

    @Column({ type: 'bit', default: true })
    printCopy: boolean;

    @ManyToOne(type => Formato, Formato => Formato.formatoText)
    formato: Formato;

    @ManyToOne(type => Fuente, Fuente => Fuente.id, { eager: true })
    fuente: Fuente;
}