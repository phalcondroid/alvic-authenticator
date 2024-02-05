import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountDoNotExistException extends HttpException {
    constructor() {
        super('Account do not exist', HttpStatus.CONFLICT);
    }
}