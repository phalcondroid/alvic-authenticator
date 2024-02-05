import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';

export interface ResponseData<T> {
    data: T;
    statusCode: number;
    message: string;
    timestamp: string;
    path: string;
}

@Injectable()
export class HttpResponseInterceptor<T> implements NestInterceptor<T, ResponseData<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ResponseData<T>> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = response.statusCode;
        const message = 'OK';
        return next.handle().pipe(
            map((data) => ({
                data,
                statusCode: status,
                message,
                timestamp: new Date().toISOString(),
                path: request.url,
            })),
        );
    }
}