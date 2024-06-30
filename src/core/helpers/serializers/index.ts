import { Logger } from '@nestjs/common';
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

export const getPagination = (query: any) => {
  const { pageNumber: skip, pageSize: take } = query;
  delete query?.pageNumber;
  delete query?.pageSize;
  return { skip, take, query } as { skip: number; take: number; query: any };
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
