import { UserEntity } from "../entities/user.entity";

export const userProviders = [
    {
        provide: 'USERS_REPOSITORY',
        useValue: UserEntity,
    },
];