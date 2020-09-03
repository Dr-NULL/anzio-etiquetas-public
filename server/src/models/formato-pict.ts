import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Formato } from './formato';
import { Picture } from './picture';

@Entity({ name: 'FormatoPict' })
export class FormatoPict extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'int', nullable: true })
    x: number;

    @Column({ type: 'int', nullable: true })
    y: number;

    @Column({ type: 'int', nullable: true })
    width: number;

    @Column({ type: 'int', nullable: true })
    height: number;

    @ManyToOne(type => Formato, Formato => Formato.id)
    formato: Formato;
    
    @ManyToOne(type => Picture, Picture => Picture.id, { eager: true })
    picture: Picture;
}