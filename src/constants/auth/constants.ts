export enum RegisterField {
  LastName = 'lastName',
  FirstName = 'firstName',
  Email = 'email',
  Password = 'password',
}

export const REGISTER_FIELD_ORDER: readonly RegisterField[] = [
  RegisterField.LastName,
  RegisterField.FirstName,
  RegisterField.Email,
  RegisterField.Password,
];

export enum LoginField {
  Email = 'email',
  Password = 'password',
}

export const LOGIN_FIELD_ORDER: readonly LoginField[] = [LoginField.Email, LoginField.Password];

export const HAS_AUTH_COOKIE = 'has-auth';
