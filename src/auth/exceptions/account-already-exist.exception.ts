import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountAlreadyExistException extends HttpException {
    constructor() {
        super('Account already exist', HttpStatus.CONFLICT);
    }
}