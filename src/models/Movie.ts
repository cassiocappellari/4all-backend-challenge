import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm'

@Entity('movies')
export default class User {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    title: string

    @Column()
    director: string

    @Column()
    quantity: number
}