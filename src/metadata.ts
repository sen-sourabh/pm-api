/* eslint-disable */
export default async () => {
  const t = {
    ['./core/modules/files/enums/index']: await import('./core/modules/files/enums/index'),
    ['./core/modules/messenger/enums/index']: await import('./core/modules/messenger/enums/index'),
    ['./core/modules/webhooks/enums/index']: await import('./core/modules/webhooks/enums/index'),
    ['./core/modules/custom-fields/enums/index']: await import(
      './core/modules/custom-fields/enums/index'
    ),
  };
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('./core/modules/activity-logs/entities/activity-log.entity'),
          {
            ActivityLog: {
              id: { required: false, type: () => String },
              handler: { required: false, type: () => String },
              method: { required: false, type: () => String },
              responseCode: { required: false, type: () => Number },
              headers: { required: false, type: () => Object },
              request: { required: false, type: () => Object },
              response: { required: false, type: () => Object },
              ipAddress: { required: false, type: () => String },
              location: { required: false, type: () => String },
              createdAt: { required: false, type: () => Date },
              updatedAt: { required: false, type: () => Date },
            },
          },
        ],
        [import('./core/modules/activity-logs/dtos/create-log.dto'), { CreateActivityLogDto: {} }],
        [
          import('./core/modules/activity-logs/dtos/list-log.dto'),
          { ListQueryActivityLogsDto: {} },
        ],
        [
          import('./modules/attachments/dtos/create-attachment.dto'),
          {
            CreateAttachmentInternalDto: {
              file: { required: true, type: () => Object },
              category: {
                required: true,
                enum: t['./core/modules/files/enums/index'].CategoryEnum,
              },
            },
            CreateAttachmentDto: {
              name: { required: false, type: () => String },
              fileFormat: {
                required: false,
                enum: t['./core/modules/files/enums/index'].FileFormatEnum,
              },
              key: { required: false, type: () => String },
              url: { required: false, type: () => String },
              vault: { required: false, type: () => String },
              user: { required: false, type: () => String },
            },
          },
        ],
        [
          import('./core/modules/messenger/dtos/messenger-request.dto'),
          {
            VerificationEmailRequestDto: {
              username: { required: true, type: () => String },
              email: { required: true, type: () => [String] },
              subject: { required: true, type: () => String },
              purpose: {
                required: true,
                type: () => String,
                enum: t['./core/modules/messenger/enums/index'].EmailPurposeEnum
                  .AccountVerification,
              },
              attachments: { required: true, type: () => Boolean },
              expiry_time: { required: true, type: () => Number },
              expiry_unit: {
                required: true,
                type: () => String,
                enum: t['./core/modules/messenger/enums/index'].ExpiryTimeUnitEnum.Minutes,
              },
            },
            EmailAttachmentsRequestDto: {
              filename: { required: true, type: () => String },
              path: { required: false, type: () => String },
            },
          },
        ],
        [
          import('./modules/account_types/entities/account_type.entity'),
          {
            AccountType: {
              id: { required: true, type: () => Number },
              name: { required: false, type: () => String },
              isDefault: { required: false, type: () => Boolean },
              isEnabled: { required: false, type: () => Boolean },
              isDeleted: { required: false, type: () => Boolean },
              createdAt: { required: false, type: () => Date },
              updatedAt: { required: false, type: () => Date },
            },
          },
        ],
        [
          import('./modules/roles/entities/role.entity'),
          {
            Role: {
              id: { required: true, type: () => Number },
              name: { required: false, type: () => String },
              isDefault: { required: false, type: () => Boolean },
              isEnabled: { required: false, type: () => Boolean },
              isDeleted: { required: false, type: () => Boolean },
              createdAt: { required: false, type: () => Date },
              updatedAt: { required: false, type: () => Date },
            },
          },
        ],
        [
          import('./modules/users/entities/user.entity'),
          {
            User: {
              id: { required: false, type: () => String },
              firstName: { required: false, type: () => String },
              lastName: { required: false, type: () => String },
              organizationName: { required: false, type: () => String },
              organizationPosition: { required: false, type: () => String },
              noOfEmployees: { required: false, type: () => String },
              email: { required: false, type: () => String },
              password: { required: false, type: () => String },
              otp: { required: false, type: () => Number },
              secretKey: { required: false, type: () => String },
              phoneNumber: { required: false, type: () => Number },
              lastLogin: { required: false, type: () => Date },
              isLogin: { required: false, type: () => Boolean },
              isEnabled: { required: false, type: () => Boolean },
              isDeleted: { required: false, type: () => Boolean },
              createdAt: { required: false, type: () => Date },
              updatedAt: { required: false, type: () => Date },
              role: { required: false, type: () => Number },
              accountType: { required: false, type: () => Number },
            },
          },
        ],
        [
          import('./core/modules/webhooks/entities/webhook.entity'),
          {
            Webhook: {
              id: { required: false, type: () => String },
              name: { required: false, type: () => String },
              event: {
                required: false,
                enum: t['./core/modules/webhooks/enums/index'].WebhookEventEnum,
              },
              targetUrl: { required: false, type: () => String },
              secret: { required: false, type: () => String },
              user: { required: false, type: () => String },
              lastTriggered: { required: false, type: () => Date },
              isEnabled: { required: false, type: () => Boolean },
              isDeleted: { required: false, type: () => Boolean },
              createdAt: { required: false, type: () => Date },
              updatedAt: { required: false, type: () => Date },
            },
          },
        ],
        [
          import('./core/modules/webhooks/entities/webhook-history.entity'),
          {
            WebhookHistory: {
              id: { required: false, type: () => String },
              webhook: { required: false, type: () => String },
              responseCode: { required: false, type: () => Number },
              status: {
                required: false,
                enum: t['./core/modules/webhooks/enums/index'].WebhookStatusEnum,
              },
              nextTrigger: { required: false, type: () => Date },
              payload: { required: false, type: () => Object },
              createdAt: { required: false, type: () => Date },
            },
          },
        ],
        [
          import('./core/modules/webhooks/dtos/create-webhook-history.dto'),
          { CreateWebhookHistoryDto: {} },
        ],
        [import('./core/modules/webhooks/dtos/create-webhook.dto'), { CreateWebhookDto: {} }],
        [import('./core/modules/webhooks/dtos/list-webhook.dto'), { ListQueryWebhooksDto: {} }],
        [import('./core/modules/webhooks/dtos/update-webhook.dto'), { UpdateWebhookDto: {} }],
        [
          import('./core/modules/auth/dtos/login.dto'),
          {
            LoginRequestDto: {
              email: { required: true, type: () => String },
              password: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./modules/users/dto/create-user.dto'),
          { CreateUserDto: { email: { required: true, type: () => String } } },
        ],
        [import('./modules/users/dto/list-user.dto'), { ListQueryUsersDto: {} }],
        [import('./modules/users/dto/update-user.dto'), { UpdateUserDto: {} }],
        [
          import('./core/modules/custom-fields/entities/custom-field.entity'),
          {
            CustomField: {
              id: { required: false, type: () => String },
              key: { required: false, type: () => String },
              name: { required: false, type: () => String },
              type: {
                required: false,
                enum: t['./core/modules/custom-fields/enums/index'].FieldTypeEnum,
              },
              placeholder: { required: false, type: () => String },
              helptext: { required: false, type: () => String },
              example: { required: false, type: () => String },
              description: { required: false, type: () => String },
              addedBy: { required: false, type: () => String },
              isEnabled: { required: false, type: () => Boolean },
              isDeleted: { required: false, type: () => Boolean },
              createdAt: { required: false, type: () => Date },
              updatedAt: { required: false, type: () => Date },
            },
          },
        ],
        [
          import('./core/modules/custom-fields/dto/create-custom-field.dto'),
          { CreateCustomFieldDto: { name: { required: true, type: () => String } } },
        ],
        [
          import('./core/modules/custom-fields/dto/list-custom-field.dto'),
          { ListQueryCustomFieldsDto: {} },
        ],
        [
          import('./core/modules/custom-fields/dto/update-custom-field.dto'),
          { UpdateCustomFieldDto: {} },
        ],
        [
          import('./core/modules/subscription/entities/feature.entity'),
          {
            Feature: {
              id: { required: false, type: () => String },
              name: { required: false, type: () => String },
              description: { required: false, type: () => String },
              isEnabled: { required: false, type: () => Boolean },
              isDeleted: { required: false, type: () => Boolean },
              createdAt: { required: false, type: () => Date },
              updatedAt: { required: false, type: () => Date },
            },
          },
        ],
        [
          import('./core/modules/subscription/dto/features/create.feature.dto'),
          { CreateFeatureDto: { name: { required: true, type: () => String } } },
        ],
        [
          import('./core/modules/subscription/dto/features/list.feature.dto'),
          { ListQueryFeaturesDto: {} },
        ],
        [
          import('./core/modules/subscription/dto/features/update.feature.dto'),
          { UpdateFeatureDto: {} },
        ],
        [
          import('./core/modules/subscription/entities/plan.entity'),
          {
            Plan: {
              id: { required: false, type: () => String },
              name: { required: false, type: () => String },
              heading: { required: false, type: () => String },
              description: { required: false, type: () => String },
              price: { required: false, type: () => Number },
              currency: { required: false, type: () => String },
              discountPercentage: { required: false, type: () => Number },
              discountPrice: { required: false, type: () => Number },
              features: { required: false, type: () => [String] },
              isEnabled: { required: false, type: () => Boolean },
              isDeleted: { required: false, type: () => Boolean },
              createdAt: { required: false, type: () => Date },
              updatedAt: { required: false, type: () => Date },
            },
          },
        ],
        [
          import('./modules/account_types/dto/list-account_type.dto'),
          { ListQueryAccountTypesDto: {} },
        ],
        [
          import('./modules/vaults/entities/vault.entity'),
          {
            Vault: {
              id: { required: false, type: () => String },
              name: { required: false, type: () => String },
              caption: { required: false, type: () => String },
              description: { required: false, type: () => String },
              isPrivate: { required: false, type: () => Boolean },
              user: { required: false, type: () => String },
              lastAccessed: { required: false, type: () => Date },
              isEnabled: { required: false, type: () => Boolean },
              isDeleted: { required: false, type: () => Boolean },
              createdAt: { required: false, type: () => Date },
              updatedAt: { required: false, type: () => Date },
            },
          },
        ],
        [
          import('./modules/vaults/dtos/create-vault.dto'),
          { CreateVaultDto: { name: { required: true, type: () => String } } },
        ],
        [import('./modules/vaults/dtos/list-vault.dto'), { ListQueryVaultsDto: {} }],
        [import('./modules/vaults/dtos/update-vault.dto'), { UpdateVaultDto: {} }],
        [
          import('./modules/attachments/entities/attachment.entity'),
          {
            Attachment: {
              id: { required: false, type: () => String },
              name: { required: false, type: () => String },
              fileFormat: {
                required: false,
                enum: t['./core/modules/files/enums/index'].FileFormatEnum,
              },
              category: {
                required: false,
                enum: t['./core/modules/files/enums/index'].CategoryEnum,
              },
              key: { required: false, type: () => String },
              url: { required: false, type: () => String },
              user: { required: false, type: () => String },
              vault: { required: false, type: () => String },
              isArchived: { required: false, type: () => Boolean },
              lastAccessed: { required: false, type: () => Date },
              createdAt: { required: false, type: () => Date },
              updatedAt: { required: false, type: () => Date },
            },
          },
        ],
        [import('./modules/attachments/dtos/list-attachment.dto'), { ListQueryAttachmentsDto: {} }],
        [
          import('./modules/providers/entities/provider.entity'),
          {
            Provider: {
              id: { required: false, type: () => String },
              vault: { required: false, type: () => String },
              name: { required: false, type: () => String },
              description: { required: false, type: () => String },
              lastAccessed: { required: false, type: () => Date },
              addedBy: { required: false, type: () => String },
              isEnabled: { required: false, type: () => Boolean },
              isDeleted: { required: false, type: () => Boolean },
              createdAt: { required: false, type: () => Date },
              updatedAt: { required: false, type: () => Date },
            },
          },
        ],
        [
          import(
            './modules/provider_field_associations/entities/provider_field_association.entity'
          ),
          {
            ProviderFieldAssociation: {
              id: { required: false, type: () => String },
              provider: { required: false, type: () => String },
              customField: { required: false, type: () => String },
              value: { required: false, type: () => String },
              addedBy: { required: false, type: () => String },
              createdAt: { required: false, type: () => Date },
              updatedAt: { required: false, type: () => Date },
            },
          },
        ],
        [
          import(
            './modules/provider_field_associations/dtos/create-provider_field_association.dto'
          ),
          { CreateProviderFieldAssociationDto: {} },
        ],
        [
          import('./modules/provider_field_associations/dtos/list-provider_field_association.dto'),
          { ListQueryProviderFieldAssociationsDto: {} },
        ],
        [
          import(
            './modules/provider_field_associations/dtos/update-provider_field_association.dto'
          ),
          { UpdateProviderFieldAssociationDto: {} },
        ],
        [
          import('./modules/providers/dtos/create-provider.dto'),
          {
            CreateProviderDto: {
              vault: { required: true, type: () => String },
              name: { required: true, type: () => String },
            },
          },
        ],
        [import('./modules/providers/dtos/list-provider.dto'), { ListQueryProvidersDto: {} }],
        [import('./modules/providers/dtos/update-provider.dto'), { UpdateProviderDto: {} }],
        [import('./modules/roles/dto/list-role.dto'), { ListQueryRolesDto: {} }],
        [
          import('./modules/vaults_collaborators/entities/vaults_collaborator.entity'),
          {
            VaultsCollaborator: {
              id: { required: false, type: () => String },
              user: { required: false, type: () => String },
              vault: { required: false, type: () => String },
              role: { required: true, type: () => Number },
              updatedBy: { required: false, type: () => String },
              isEnabled: { required: false, type: () => Boolean },
              createdAt: { required: false, type: () => Date },
              updatedAt: { required: false, type: () => Date },
            },
          },
        ],
        [
          import('./modules/vaults_collaborators/dtos/create-vaults-collaborator.entity'),
          {
            CreateVaultsCollaboratorDto: {
              user: { required: true, type: () => String },
              vault: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./modules/vaults_collaborators/dtos/list-vaults-collaborator.entity'),
          { ListQueryVaultsCollaboratorDto: {} },
        ],
        [
          import('./modules/vaults_collaborators/dtos/update-vaults-collaborator.entity'),
          {
            UpdateVaultsCollaboratorDto: {
              user: { required: true, type: () => String },
              vault: { required: true, type: () => String },
            },
          },
        ],
        [import('./core/shared/dtos/response.dto'), { ApiResponseDto: {} }],
        [
          import('./core/modules/files/dtos/create-file.dto'),
          { CreateFilesDto: { entityId: { required: true, type: () => String } } },
        ],
        [
          import('./core/modules/subscription/dto/create-subscription.dto'),
          { CreateSubscriptionDto: {} },
        ],
        [
          import('./core/modules/subscription/dto/update-subscription.dto'),
          { UpdateSubscriptionDto: {} },
        ],
        [
          import('./core/modules/webhooks/dtos/webhook-request.dto'),
          {
            WebhookRequestDto: {
              type: { required: false, type: () => String },
              payload: { required: false, type: () => Object },
            },
          },
        ],
        [import('./core/shared/dtos/paginate.dto'), { ApiPaginateDto: {} }],
        [
          import('./modules/account_types/dto/create-account_type.dto'),
          { CreateAccountTypeDto: {} },
        ],
        [
          import('./modules/account_types/dto/update-account_type.dto'),
          { UpdateAccountTypeDto: {} },
        ],
        [import('./modules/roles/dto/create-role.dto'), { CreateRoleDto: {} }],
        [import('./modules/roles/dto/update-role.dto'), { UpdateRoleDto: {} }],
      ],
      controllers: [
        [import('./app.controller'), { AppController: { isServerRunning: {} } }],
        [
          import('./core/modules/activity-logs/activity-logs.controller'),
          { ActivityLogsController: { findAllActivityLogs: {}, findOneActivityLog: {} } },
        ],
        [
          import('./core/modules/messenger/messenger.controller'),
          { MessengerController: { sendOTP: { type: Object } } },
        ],
        [
          import('./core/modules/webhooks/webhooks.controller'),
          {
            WebhooksController: {
              createWebhook: {},
              findAllWebhooks: {},
              findOneWebhook: {},
              updateWebhook: {},
              removeWebhook: {},
            },
          },
        ],
        [
          import('./modules/users/users.controller'),
          {
            UsersController: {
              createUser: {},
              findAllUsers: {},
              findOneUser: {},
              updateUser: {},
              removeUser: {},
            },
          },
        ],
        [
          import('./core/modules/auth/auth.controller'),
          { AuthController: { login: {}, register: {} } },
        ],
        [
          import('./core/modules/custom-fields/custom-fields.controller'),
          {
            CustomFieldsController: {
              createCustomField: {},
              findAllCustomFields: {},
              findOneCustomField: {},
              updateCustomField: {},
              removeCustomField: {},
            },
          },
        ],
        [
          import('./core/modules/subscription/features/feature.controller'),
          {
            FeaturesController: {
              createFeature: {},
              findAllFeatures: {},
              findOneFeature: {},
              updateFeature: {},
              removeFeature: {},
            },
          },
        ],
        [
          import('./modules/account_types/account_types.controller'),
          { AccountTypesController: { findAllAccountTypes: {}, findOneUsertype: {} } },
        ],
        [
          import('./modules/attachments/attachments.controller'),
          {
            AttachmentsController: {
              upsertAttachment: {},
              findAllAttachments: {},
              findOneAttachment: {},
            },
          },
        ],
        [
          import('./modules/vaults/vaults.controller'),
          {
            VaultsController: {
              createVault: {},
              findAllVaults: {},
              findOneVault: {},
              updateVault: {},
              removeVault: {},
            },
          },
        ],
        [
          import('./modules/provider_field_associations/provider_field_associations.controller'),
          {
            ProviderFieldAssociationsController: {
              createProviderFieldAssociation: {},
              findAllProviderFieldAssociations: {},
              findOneProviderFieldAssociation: {},
              updateProviderFieldAssociation: {},
              removeProviderFieldAssociation: {},
            },
          },
        ],
        [
          import('./modules/providers/providers.controller'),
          {
            ProvidersController: {
              createProvider: {},
              findAllProviders: {},
              findOneProvider: {},
              updateProvider: {},
              removeProvider: {},
            },
          },
        ],
        [
          import('./modules/roles/roles.controller'),
          { RolesController: { findAllRoles: {}, findOneRole: {} } },
        ],
        [
          import('./modules/vaults_collaborators/vaults_collaborators.controller'),
          {
            VaultsCollaboratorsController: {
              createVaultsCollaborator: {},
              findAllVaultsCollaborators: {},
              findOneVaultsCollaborator: {},
              updateVaultsCollaborator: {},
              removeVaultsCollaborator: {},
            },
          },
        ],
      ],
    },
  };
};