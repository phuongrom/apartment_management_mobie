import { User } from "@/types/User";

export const transformUser = (data: any): User => ({
  id: data.id,
  userName: data.username,
  email: data.email,
  firstName: data.first_name,
  lastName: data.last_name?.trim(),
  phoneNumber: data.phone_number,
  avatar: data.avatar,
  role: data.role,
  isActive: data.is_active,
  isFirstLogin: data.is_first_login,
  apartments: data.apartments,
});
