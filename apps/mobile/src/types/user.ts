/** Table `users` (sans password_hash côté app). */
export interface User {
  id: number;
  name: string;
  email: string;
  fidelityPoints: number;
  roles: string[];
}

/** Informations client éditables (écran « Mes informations »). */
export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
}
