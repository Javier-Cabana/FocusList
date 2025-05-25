export interface TareaResponseDTO {
  id: string;
  titulo: string;
  descripcion: string;
  completada: boolean;
  fechaCreacion: string;
  fechaVencimiento: string;
  idLista: string;
  idEtiqueta: string;
}

export interface TareaCreateDTO {
  titulo: string;
  descripcion: string;
  fechaVencimiento: string; // ISO8601, e.g. "2025-06-14T08:16:15.593Z"
  idLista: string;
  idEtiqueta: string; // Puede ir vacío si no tiene etiqueta
}

export interface TareaUpdateDTO {
  id: string;
  titulo: string;
  descripcion: string;
  completada: boolean;
  fechaVencimiento: string; // ISO8601, p.ej. "2025-06-14T08:16:15.593Z"
  idLista: string;
  idEtiqueta: string;
}
