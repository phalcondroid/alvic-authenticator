import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountDoNotVerifiedException extends HttpException {
    constructor() {
        super('Account do not verified', HttpStatus.CONFLICT);
    }
}