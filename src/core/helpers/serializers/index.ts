import { HttpStatusViaCode } from '../../shared/enums';
import { ApiResponseCommonModel } from '../../shared/models/api-response.model';
import { isMissing } from '../validations';

export const getHttpStatusViaCode = (data: ApiResponseCommonModel, response: any) => {
  let statusCode = data?.statusCode;
  if (isMissing(statusCode)) {
    statusCode = response?.statusCode;
  }

  if (statusCode.toString().startsWith('1')) {
    return HttpStatusViaCode.Info;
  }
  if (statusCode.toString().startsWith('2')) {
    return HttpStatusViaCode.Success;
  }
  if (statusCode.toString().startsWith('3')) {
    return HttpStatusViaCode.Redirect;
  }
  if (statusCode.toString().startsWith('4')) {
    return HttpStatusViaCode.Client_Error;
  }
  return HttpStatusViaCode.Server_Error;
};
