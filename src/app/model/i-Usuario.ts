export interface ListaResumenDTO {
  id: string;
  nombre: string;
}

export interface UsuarioResponseDTO {
  id: string;
  username: string;
  email: string;
  password: string;
  listas: ListaResumenDTO[];
}
