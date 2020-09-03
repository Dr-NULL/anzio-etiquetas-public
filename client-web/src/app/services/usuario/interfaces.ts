import { Usuario, Menu } from 'src/app/models';

export interface CheckSystemUser {
  exists: boolean;
}

export interface CheckSession {
  user: Usuario;
  menu: Menu[];
}
