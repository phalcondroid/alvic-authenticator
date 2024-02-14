import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';
import { CreateUserRequest, LoginRequest, ResendUserRequest, ResetPassword } from '../contracts/createUser-request.interface';
import { AuthService } from '../services/auth.service';
import { UserEntity } from '../entities/user.entity';

@Controller('auth')
export class AuthController {

    constructor(private readonly service: AuthService) { }

    @Get(":email")
    async get(@Param() params: any): Promise<UserEntity> {
        return await this.service.getById(params.email);
    }

    @Post("login")
    async login(@Body() login: LoginRequest): Promise<boolean> {
        return await this.service.doLogin(login.email, login.password);
    }

    @Post()
    async create(@Body() user: CreateUserRequest): Promise<UserEntity> {
        return this.service.create(user);
    }

    @Post("resend")
    async resend(@Body() email: ResendUserRequest): Promise<boolean> {
        return this.service.resendEmail(email);
    }

    @Get('verify/:uid')
    @Render('email-verification')
    async verify(@Param() params: any): Promise<any> {
        const result = await this.service.verify(params.uid);
        return {
            msj: result.msj,
            error: result.error,
            succ: result.succ,
            already: result.already,
            baseUrl: process.env.BASE_URL
        };
    }

    @Get('reset/:email')
    async requestResetPassword(@Param() params: any): Promise<any> {
        return await this.service.sendEmailResetPassword(params.email);
    }

    @Get('reset/:email/:uid')
    @Render('reset-password')
    async reset(@Param() params: any): Promise<any> {
        try {
            const result = await this.service.getByUid(params.uid);
            if (!result) {
                return { error: "error", baseUrl: process.env.BASE_URL };
            }
        } catch (error) {
            return { error: "error", baseUrl: process.env.BASE_URL };
        }
        return { uid: params.uid, baseUrl: process.env.BASE_URL };
    }

    @Post("reset-confirmation/:uid")
    @Render('reset-password')
    async resetPassword(@Param() params: any, @Body() data: ResetPassword): Promise<any> {
        const msj = await this.service.resetPassword(
            params.uid,
            data.old,
            data.new,
            data.confirm
        );
        return { uid: params.uid, response: msj, baseUrl: process.env.BASE_URL };
    }


    @Get('forget/:email')
    async forgetRequest(@Param() params: any): Promise<any> {
        return await this.service.forgetRequest(params.email);
    }

    @Get('deletion-request/:uid/:password')
    async deletionRequest(@Param() params: any): Promise<any> {
        return { msj: await this.service.deletionRequest(params.uid, params.password) };
    }

    @Get('delete/:uid')
    @Render('confirm-deletion-account')
    async delete(@Param() params: any): Promise<any> {
        return { uid: params.uid, baseUrl: process.env.BASE_URL };
    }

    @Get("confirm-deletion/:uid")
    async confirmDeletion(@Body() data: any): Promise<boolean> {
        return true;
    }
}
