import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { PICTURE_FILE } from '../endpoints/picture-file';
import { APP_CONFIG } from '..';

@Entity({ name: 'Picture' })
export class Picture extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'bit', default: 1 })
    isActive: boolean;
    
    @Column({ type: 'varchar', length: 200 })
    nombre: string;
    
    @Column({ type: 'varchar', length: 1024 })
    descripc: string;
    
    @Column({ type: 'varchar', length: 5 })
    ext: string;
    
    @Column({ type: 'int' })
    width: number;
    
    @Column({ type: 'int' })
    height: number;
}