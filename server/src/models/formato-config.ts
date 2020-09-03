import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Producto } from './producto';
import { Pais } from './pais';
import { Formato } from './formato';

@Entity({ name: 'FormatoConfig' })
export class FormatoConfig extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'bit', default: 1 })
  isActive: boolean;
  
  @ManyToOne(type => Producto, Producto => Producto.id, { eager: true })
  producto: Producto;
  
  @ManyToOne(type => Pais, Pais => Pais.id, { eager: true })
  pais: Pais;
  
  @ManyToOne(type => Formato, Formato => Formato.id, { eager: true })
  formato: Formato;

  public static async findFormato(pais: Pais, producto: Producto) {
    // Buscar los formatos que aplican
    const data = await this.find()
    const out: Formato[] = []
    for (const item of data) {
      if (
        (item.formato.isActive) &&
        (pais.id == item.pais.id) &&
        (producto.id == item.producto.id)
      ) {
        out.push(item.formato)
      }
    }

    return out
  }
}