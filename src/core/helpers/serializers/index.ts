import { S3ServiceException } from '@aws-sdk/client-s3';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  Logger,
  MethodNotAllowedException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  RequestTimeoutException,
  UnauthorizedException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { HttpStatusViaCodeEnum } from '../../shared/enums';
import { ApiResponseUnifiedModel } from '../../shared/models/api-response.model';
import { isMissing } from '../validations';

export const getHttpStatusViaCode = (data: ApiResponseUnifiedModel, response: any) => {
  let statusCode = data?.statusCode;
  if (isMissing(statusCode)) {
    statusCode = response?.statusCode;
  }

  if (statusCode.toString().startsWith('1')) {
    return HttpStatusViaCodeEnum.Info;
  }
  if (statusCode.toString().startsWith('2')) {
    return HttpStatusViaCodeEnum.Success;
  }
  if (statusCode.toString().startsWith('3')) {
    return HttpStatusViaCodeEnum.Redirect;
  }
  if (statusCode.toString().startsWith('4')) {
    return HttpStatusViaCodeEnum.ClientError;
  }
  return HttpStatusViaCodeEnum.ServerError;
};

export const getPagination = (query?: any) => {
  const { pageNumber: skip, pageSize: take, relation: relations } = query;
  delete query?.pageNumber;
  delete query?.pageSize;
  delete query?.relation;
  return { skip, take, relations } as {
    skip: number;
    take: number;
    relations: boolean;
  };
};

export const buildActivityLog = (handler: string | null, request: any, response: any) => {
  return {
    handler,
    method: request?.method,
    headers: request?.headers,
    request: {
      url: request?.url,
      method: request?.method,
      query: request?.query,
      body: request?.body,
      params: request?.params,
    },
    response: String(response?.statusCode)?.startsWith('2') ? response?.statusCode : response,
    responseCode: +response?.statusCode,
    ipAddress: request?.ip,
    location: null,
  };
};

export const logErrorOnTerminal = (data: any) => {
  delete data?.handler;
  delete data?.method;
  delete data?.headers;
  delete data?.location;
  delete data?.responseCode;

  switch (String(data?.response?.statusCode)?.[0]) {
    case '3':
      Logger.verbose(`${JSON.stringify(data).toString()}`);
      break;
    case '4':
      Logger.warn(`${JSON.stringify(data).toString()}`);
      break;
    case '5':
      Logger.error(`${JSON.stringify(data).toString()}`);
      break;
    default:
      Logger.log(`${JSON.stringify(data).toString()}`);
  }
};

// Function Not In-Use
export const catchLogExceptions = (error: any) => {
  if (error instanceof BadRequestException) {
    return error;
  }
  if (error instanceof NotFoundException) {
    return error;
  }
  if (error instanceof ConflictException) {
    return error;
  }
  if (error instanceof UnauthorizedException) {
    return error;
  }
  if (error instanceof ForbiddenException) {
    return error;
  }
  if (error instanceof S3ServiceException) {
    return error;
  }
  if (error instanceof NotAcceptableException) {
    return error;
  }
  if (error instanceof GatewayTimeoutException) {
    return error;
  }
  if (error instanceof NotImplementedException) {
    return error;
  }
  if (error instanceof UnprocessableEntityException) {
    return error;
  }
  if (error instanceof UnsupportedMediaTypeException) {
    return error;
  }
  if (error instanceof RequestTimeoutException) {
    return error;
  }
  if (error instanceof MethodNotAllowedException) {
    return error;
  }
  return error;
};
