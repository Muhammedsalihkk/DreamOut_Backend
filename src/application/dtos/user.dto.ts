export interface CreateUserDTO {
  email: string;
  name?: string;
  password?: string;
  avatar?: string;
}

export interface UpdateUserDTO {
  email?: string;
  name?: string;
  password?: string;
  avatar?: string;
}

export interface UserResponseDTO {
  id: number;
  email: string;
  name: string | null;
  avatar?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export function sanitizeUser(user: any): UserResponseDTO {
  if (!user) return user;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
