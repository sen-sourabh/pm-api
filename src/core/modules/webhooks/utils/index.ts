import { getLocalDateTime } from '../../auth/utils';

export const evaluateNextTriggerDateTime = () => {
  const current_date = getLocalDateTime();
  const future_date = current_date.setHours(current_date.getHours() + 2);
  return new Date(future_date);
};
