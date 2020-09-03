export { loadSeeds } from '../tool/seeds';

import { loadTipoUsuarios } from './load-tipo-usuario'; 
import { loadMenu } from './load-menu';
import { loadLang } from './load-lang';
import { loadFamilias } from './load-familia';
import { loadProducto } from './load-producto';
import { loadFuentes } from './load-fonts';
import { loadPicture } from './load-picture';
import { loadFormato } from './load-formato';
import { loadFormatoConfig } from './load-formato-config';

export const SEEDS: Array<() => Promise<void>> = [
    loadTipoUsuarios,
    loadMenu,
    loadFamilias,
    loadLang,
    loadProducto,
    loadFuentes,
    loadPicture,
    loadFormato,
    loadFormatoConfig
]