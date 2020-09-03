import { ProductoDet } from './producto-det';
import { Familia } from './familia';

export class Producto {
  id: number;
  isActive: boolean;
  codigo: string;
  descripc: string;
  familia: Familia;
  productoDet: ProductoDet[];

  constructor() {
    this.familia = new Familia();
    this.productoDet = [];
  }
}
