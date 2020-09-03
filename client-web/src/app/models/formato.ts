import { FormatoText } from './formato-text';
import { FormatoRect } from './formato-rect';
import { FormatoPict } from './formato-pict';

export class Formato {
    id: number;
    codigo: string;
    descripc: string;
    width: number;
    height: number;
    isActive: boolean;
    formatoText: FormatoText[];
    formatoRect: FormatoRect[];
    formatoPict: FormatoPict[];

    public constructor() {
      this.codigo = 'N/A';
      this.descripc = 'No se ha cargado ninguna Etiqueta.';
      this.width = 150;
      this.height = 100;
      this.formatoText = [];
      this.formatoRect = [];
      this.formatoPict = [];
    }
}
