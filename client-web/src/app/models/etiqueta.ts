import { Producto } from './producto';
import { Pais } from './pais';

export class Etiqueta {
  id: number;
  barcode: string;
  codAnimal: string;
  pesoBruto: number;
  pesoNeto: number;
  fechaImpres: Date;
  fechaFaena: Date;
  fechaProducc: Date;
  fechaVencim: Date;
  loteCertif: number;
  contrato: number;
  producto: Producto;
  pais: Pais;
}
