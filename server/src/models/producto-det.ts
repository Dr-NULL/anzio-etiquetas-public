import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Producto } from './producto';
import { Language } from './language';

@Entity({ name: 'ProductoDet' })
export class ProductoDet extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
  
  @Column({ type: 'nvarchar', length: 256 })
  descripc: string;
  
  @ManyToOne(type => Language, Language => Language.id, { eager: true })
  language: Language;
  
  @ManyToOne(type => Producto, Producto => Producto.id)
  producto: Producto | Promise<Producto>;
}