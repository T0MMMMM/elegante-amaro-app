/** Table `users` (sans password_hash côté app). */
export interface User {
  id: number;
  name: string;
  email: string;
  fidelityPoints: number;
  roles: string[];
}
