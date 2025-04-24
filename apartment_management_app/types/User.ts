export interface ApartmentUser {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface Apartment {
  id: number;
  name: string;
  address: string;
  image: string;
  maxCapacity: number;
  owner: ApartmentUser;
  users: ApartmentUser[];
}

export interface User {
  id: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatar: string;
  role: string;
  isActive: boolean;
  isFirstLogin: boolean;
  apartments: Apartment[];
}
