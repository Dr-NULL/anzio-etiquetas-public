import { Producto } from '../models/producto';
import { Formato } from '../models/formato';
import { Pais } from '../models/pais';
import { FormatoConfig } from '../models/formato-config';

export async function loadFormatoConfig() {
  let pais = new Pais()
  pais.codigo = 'CHN'
  pais.descripc = 'China'
  await pais.save()

  const formato = await Formato.findOne()
  const productos = await Producto.find()

  for (const prod of productos) {
    const setter = new FormatoConfig()
    setter.pais = pais
    setter.formato = formato
    setter.producto = prod

    await setter.save()
  }

  pais = new Pais()
  pais.codigo = 'xD'
  pais.descripc = 'jajajjja'
  await pais.save()
}
