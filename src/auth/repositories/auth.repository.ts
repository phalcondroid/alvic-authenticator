import { Inject, Injectable } from "@nestjs/common";
import { CreateUserRequest } from "../contracts/createUser-request.interface";
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from "../entities/user.entity";

@Injectable()
export class AuthRepository {

    constructor(
        @Inject('USERS_REPOSITORY')
        private userRepository: typeof UserEntity
    ) { }

    /**
     * Create user
     * @param user 
     * @returns 
     */
    async create(user: CreateUserRequest): Promise<UserEntity> {
        return this.userRepository.create({
            email: user.email,
            emailVerified: false,
            phoneNumber: user.phoneNumber,
            password: user.password,
            displayName: user.displayName,
            photoURL: 'https://www.alvic.net/img/alvic.jpg',
            disabled: false,
            uid: uuidv4()
        });
    }

    async getUserByEmail(email: string): Promise<UserEntity> {
        return this.userRepository.findOne<UserEntity>({
            where: { email, disabled: false }
        });
    }

    async getById(id: number): Promise<UserEntity> {
        return this.userRepository.findByPk<UserEntity>(id);
    }

    async getUserByUid(uid: string): Promise<UserEntity> {
        return this.userRepository.findOne<UserEntity>({
            where: { uid, disabled: false }
        });
    }

    async verifyAccountCreation(uid: string): Promise<UserEntity> {
        const exist = await this.getUserByUid(uid);
        if (exist) {
            exist.emailVerified = true;
            await exist.save();
        }
        return exist;
    }

    async resetPassword(uid: string, old: string, newPass: string): Promise<boolean> {
        const exist = await this.getUserByUid(uid);
        if (exist && exist.password === old) {
            exist.password = newPass;
            await exist.save();
            return true;
        }
        return false;
    }

    async auth(email: string, pass: string): Promise<boolean> {
        const exist = await this.getUserByEmail(email);
        if (exist && exist.password === pass) {
            return true;
        }
        return false;
    }
}