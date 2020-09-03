import { UsuarioTipo } from './usuario-tipo';

export class Usuario {
  id: number;
  isActive: boolean;
  createdAt: Date;
  rut: string;
  nombres: string;
  apellidoP: string;
  apellidoM: string;
  user: string;
  pass: string;
  mail: string;
  token: string;
  usuarioTipo: UsuarioTipo;
}
