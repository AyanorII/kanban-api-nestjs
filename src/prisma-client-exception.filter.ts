import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Request, Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const id = request.params.id;
    const resource =
      request.path.split('/')[1][0].toUpperCase() +
      request.path.split('/')[1].slice(1, -1);

    let status: HttpStatus;
    let message: string = exception.message.replace(/\n/g, '');
    let error: string;

    switch (exception.code) {
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = `No ${resource} found with ID: '${id}'`;
        error = 'Not Found';
        break;
      default:
        super.catch(exception, host);
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
    });
  }
}
