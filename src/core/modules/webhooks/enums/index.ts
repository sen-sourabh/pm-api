export enum WebhookEventEnum {
  //User event
  UserCreated = 'user:created',
  UserUpdated = 'user:updated',
  UserDeleted = 'user:deleted',
  //Vault event
  VaultCreated = 'vault:created',
  VaultUpdated = 'vault:updated',
  VaultDeleted = 'vault:deleted',
  //Collaborator event
  CollaboratorCreated = 'collaborator:created',
  CollaboratorUpdated = 'collaborator:updated',
  CollaboratorDeleted = 'collaborator:deleted',
  //Provider event
  ProviderCreated = 'provider:created',
  ProviderUpdated = 'provider:updated',
  ProviderDeleted = 'provider:deleted',
  //ProviderFieldAssociation event
  ProviderFieldAssociationCreated = 'providerFieldAssociation:created',
  ProviderFieldAssociationUpdated = 'providerFieldAssociation:updated',
  ProviderFieldAssociationDeleted = 'providerFieldAssociation:deleted',
  //CustomField event
  CustomFieldCreated = 'customField:created',
  CustomFieldUpdated = 'customField:updated',
  CustomFieldDeleted = 'customField:deleted',
  //Attachment event
  AttachmentCreated = 'attachment:created',
  AttachmentUpdated = 'attachment:updated',
  AttachmentDeleted = 'attachment:deleted',
}

export enum WebhookStatusEnum {
  Success = 'success',
  Failed = 'failed',
}
