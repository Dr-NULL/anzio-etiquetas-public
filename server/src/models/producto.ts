import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ObjectType, FindManyOptions } from 'typeorm';
import { Familia } from './familia';
import { ProductoDet } from './producto-det';

@Entity({ name: 'Producto' })
export class Producto extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'bit', default: 1 })
  isActive: boolean;

  @Column({ type: 'varchar', length: 14, unique: true })
  codigo: string;
  descripc: string;

  @ManyToOne(type => Familia, Familia => Familia.id, { eager: true })
  familia: Familia;

  @OneToMany(type => ProductoDet, DetProducto => DetProducto.producto, { eager: true })
  productoDet: ProductoDet[];

  async save() {
    this.codigo = this.codigo.toUpperCase()
    return super.save()
  }
}