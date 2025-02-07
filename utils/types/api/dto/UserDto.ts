export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUserDto = {
  name: string;
  email: string;
};

export type UpdateUserPasswordDto = {
  password?: string;
  oldPassword?: string;
};
