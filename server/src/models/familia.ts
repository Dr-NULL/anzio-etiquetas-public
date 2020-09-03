import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import '../tool/capitalize'

@Entity({ name: 'Familia' })
export class Familia extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'bit', default: 1 })
  isActive: boolean;

  @Column({ type: 'varchar', length: 2 })
  codigo: string;

  @Column({ type: 'varchar', length: 50 })
  descripc: string;

  async save() {
    this.codigo = this.codigo.toUpperCase()
    this.descripc = this.descripc.capitalize()
    return super.save()
  }
}