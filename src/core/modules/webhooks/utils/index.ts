import { getLocalDateTime } from '../../auth/utils';

export const evaluateNextTriggerDateTime = () => {
  let current_date = getLocalDateTime();
  let future_date = current_date.setHours(current_date.getHours() + 2);
  return new Date(future_date);
};
