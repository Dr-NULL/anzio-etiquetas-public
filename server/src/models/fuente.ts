import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import '../tool/capitalize';

@Entity({ name: 'Fuente' })
export class Fuente extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'bit', default: 1 })
    isActive: boolean;
    
    @Column({ type: 'varchar', length: 64 })
    nombre: string;
    
    @Column({ type: 'varchar', length: 64 })
    fontFace: string;
    
    @Column({ type: 'varchar', length: 512 })
    filename: string;

    async save() {
        this.nombre = this.nombre.capitalize()
        this.filename = this.filename.replace(/\\/gi, '/')
        return super.save()
    }
}