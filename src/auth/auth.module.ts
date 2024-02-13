import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { firebaseProvider, mailerConfig } from './config/auth.config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthRepository } from './repositories/auth.repository';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { databaseProviders } from '../database/database.config';
import { userProviders } from './config/model.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [
        ConfigModule, MailerModule.forRoot({
            transport: {
                host: mailerConfig.server,
                auth: {
                    user: mailerConfig.from,
                    pass: mailerConfig.password
                },
            },
            template: {
                dir: __dirname + '/templates',
                adapter: new HandlebarsAdapter(),
                options: { strict: true },
            }
        }),
        DatabaseModule,
    ],
    providers: [...userProviders, firebaseProvider, AuthService, AuthRepository],
    exports: [],
    controllers: [AuthController],
})
export class AuthModule { }
