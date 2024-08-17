import { User } from '../entities/user.entity';

export const getUsersFullName = ({ firstName, lastName }: Partial<User>) => {
  return firstName + ' ' + lastName;
};
