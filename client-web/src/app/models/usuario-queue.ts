import { UsuarioTipo } from './usuario-tipo';
import { Usuario } from '../services/usuario/usuario.service';

export class UsuarioQueue {
  id: number;
  createdAt: Date;
  user: string;
  mail: string;
  hold: boolean;
  token: string;
  creator: Usuario;
  usuarioTipo: UsuarioTipo;
}
