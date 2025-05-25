export interface ListaResponseDTO {
  id: string;
  nombre: string;
  fechaCreacion: string;  // ISO date
  idUsuario: string;
  tareas: string[];       // Array de UUID de tareas
}

export interface ListaCreateDTO {
  nombre: string;
  idUsuario: string;
}

export interface ListaUpdateDTO {
  id: string;
  nombre: string;
  idUsuario: string;
}

export interface ListaGetDTO {
  nombre: string;
  idUsuario: string;
}
