import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable} from 'typeorm'
import User from './User'

@Entity('movies')
export default class Movie {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    title: string

    @Column()
    director: string

    @Column()
    quantity: number

    @ManyToMany(() => User)
    @JoinTable({name: 'movies_users'})
    users: User[]
}