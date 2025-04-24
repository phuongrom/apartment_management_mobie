import { User } from "./User";

export interface Apartment {
  id: number;
  name: string;
  address: string;
  image: string;
  max_capacity: number;
  owner: User;
  users: User[];
}