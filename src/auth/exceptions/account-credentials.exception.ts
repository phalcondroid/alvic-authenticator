import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountCredentialsException extends HttpException {
    constructor() {
        super('Account credentials wrong', HttpStatus.CONFLICT);
    }
}