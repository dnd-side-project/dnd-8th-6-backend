import { IsInt } from 'class-validator';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn,  } from 'typeorm';

@Entity()
export class User extends BaseEntity {
    @IsInt()
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id',
    })
    id!: number;

}
