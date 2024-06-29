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
