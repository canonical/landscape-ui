export interface License extends Record<string, unknown> {
  id: number;
  available_seats: number;
  used_seats: number;
  expiration_date: string | null;
  license_type: string;
}
