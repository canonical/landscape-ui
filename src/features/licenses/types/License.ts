export interface License extends Record<string, unknown> {
  id: number;
  available_seats: number;
  expiration_date: string | null;
  used_seats?: number;
  license_type?: string;
}
