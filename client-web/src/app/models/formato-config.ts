import { Producto } from './producto';
import { Formato } from './formato';
import { Pais } from './pais';

export class FormatoConfig {
  id: number;
  producto: Producto;
  pais: Pais;
  formato: Formato;
  isActive: boolean;
}
