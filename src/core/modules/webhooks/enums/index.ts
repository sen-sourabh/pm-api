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
  FieldAssociationCreated = 'fieldAssociation:created',
  FieldAssociationUpdated = 'fieldAssociation:updated',
  FieldAssociationDeleted = 'fieldAssociation:deleted',
  //CustomField event
  CustomFieldCreated = 'customField:created',
  CustomFieldUpdated = 'customField:updated',
  CustomFieldDeleted = 'customField:deleted',
  //Attachment event
  AttachmentCreated = 'attachment:created',
  AttachmentUpdated = 'attachment:updated',
  AttachmentDeleted = 'attachment:deleted',
  //Feature event
  FeatureCreated = 'feature:created',
  FeatureUpdated = 'feature:updated',
  FeatureDeleted = 'feature:deleted',
  //Plan event
  PlanCreated = 'plan:created',
  PlanUpdated = 'plan:updated',
  PlanDeleted = 'plan:deleted',
}

export enum WebhookStatusEnum {
  Success = 'success',
  Failed = 'failed',
}
