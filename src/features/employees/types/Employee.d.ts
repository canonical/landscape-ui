import type { Instance } from "@/types/Instance";

export interface Employee extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  issuer: string;
  subject: string;
  is_active: boolean;
  computers: Instance[] | null;
}

export interface RecoveryKey {
  fde_recovery_key: string;
}
