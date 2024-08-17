export enum EmailPurposeEnum {
  SignIn = 'sign_in',
  PasswordReset = 'password_reset',
  AccountVerification = 'account_verification',
  Custom = 'custom', // Add this if you want to support custom email purposes
}

export enum ExpiryTimeUnitEnum {
  Seconds = 'seconds',
  Minutes = 'minutes',
  Hours = 'hours',
  Days = 'days',
  Weeks = 'weeks',
  Months = 'months',
}
