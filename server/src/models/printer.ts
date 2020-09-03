import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Formato } from './formato';

@Entity({ name: 'Printer' })
export class Printer extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToOne(type => Formato, Formato => Formato.printers)
  formato: Formato;
}
