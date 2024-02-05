import { Column, Table, Model, Unique } from 'sequelize-typescript';

@Table({
    tableName: 'user',
})
export class UserEntity extends Model {
    @Column({ unique: true })
    uid: string;

    @Column({ unique: true })
    email: string;

    @Column
    phoneNumber: string;

    @Column
    password: string;

    @Column
    displayName: string;

    @Column
    photoURL: string;

    @Column
    disabled: boolean;

    @Column
    emailVerified: boolean;
}