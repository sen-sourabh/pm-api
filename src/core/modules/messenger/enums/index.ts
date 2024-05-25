export enum EmailPurposeEnum {
  SIGNUP = 'Sign Up',
  PASSWORD_RESET = 'Password Reset',
  ACCOUNT_VERIFICATION = 'Account Verification',
  CUSTOM = 'Custom', // Add this if you want to support custom email purposes
}

export enum ExpiryTimeUnitEnum {
  SECONDS = 'seconds',
  MINUTES = 'minutes',
  HOURS = 'hours',
  DAYS = 'days',
  WEEKS = 'weeks',
  MONTHS = 'months',
}
