export interface CreateUserDTO {
  email: string;
  name?: string;
  password?: string;
}

export interface UpdateUserDTO {
  email?: string;
  name?: string;
  password?: string;
}

export interface UserResponseDTO {
  id: number;
  email: string;
  name: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export function sanitizeUser(user: any): UserResponseDTO {
  if (!user) return user;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
