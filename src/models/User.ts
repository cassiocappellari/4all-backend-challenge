import {Entity, Column, PrimaryGeneratedColumn, BeforeInsert} from 'typeorm'
import bcrypt from 'bcryptjs'

@Entity('users')
export default class User {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string

    @BeforeInsert()
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, Number(process.env.BCRYPT_SALTROUNDS))
    }
}