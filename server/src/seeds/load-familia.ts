import { Familia } from '../models/familia';

export async function loadFamilias() {
    let fam = new Familia()
    fam.codigo = 'sp'
    fam.descripc = 'subproductos'
    await fam.save()
}
