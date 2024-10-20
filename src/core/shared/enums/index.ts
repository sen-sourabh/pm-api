export enum AccountTypesEnum {
  Organization = 'organization',
  Individual = 'individual',
}

export enum RolesEnum {
  SuperAdmin = 'super_admin',
  Admin = 'admin',
  Collaborator = 'collaborator',
}

export enum VaultAccessEnum {
  Admin = 'admin',
  Collaborator = 'collaborator',
}

export enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum HttpStatusViaCodeEnum {
  Info = 'info',
  Success = 'success',
  Redirect = 'redirect',
  ClientError = 'client_error',
  ServerError = 'server_error',
}

export enum ApiXResponsesEnum {
  BadRequest = 'bad_request',
  Unauthorized = 'unauthorized',
  NotImplemented = 'not_implemented',
  NotFound = 'not_found',
  Conflict = 'conflict',
}
