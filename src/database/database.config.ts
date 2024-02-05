
import { Sequelize } from 'sequelize-typescript';
import { UserEntity } from '../auth/entities/user.entity';

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize({
                dialect: 'sqlite',
                storage: ':memory:'
            });
            sequelize.addModels([UserEntity]);
            await sequelize.sync();
            return sequelize;
        },
    },
];