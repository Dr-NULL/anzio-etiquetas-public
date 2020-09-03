import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import '../tool/capitalize';

@Entity({ name: 'Language' })
export class Language extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'bit', default: 1 })
    isActive: boolean;

    @Column({ type: 'bit', default: 0 })
    default: boolean;
    
    @Column({ type: 'varchar', length: 10 })
    codigo: string;
    
    @Column({ type: 'varchar', length: 50 })
    descripc: string;

    async save() {
        this.codigo = this.codigo.toUpperCase()
        this.descripc = this.descripc.capitalize()
        return super.save()
    }
}