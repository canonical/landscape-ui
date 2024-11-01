export interface GetGPGKeysParams {
  names?: string[];
}

export interface ImportGPGKeyParams {
  material: string;
  name: string;
}

export interface RemoveGPGKeyParams {
  name: string;
}
