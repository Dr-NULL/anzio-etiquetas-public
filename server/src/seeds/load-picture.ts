import { Picture } from '../models/picture';

export async function loadPicture() {
    let pict = new Picture()
    pict.nombre = '20190101000000165023051'
    pict.descripc = 'Logo Certif. Halal'
    pict.ext = 'bmp'
    pict.width = 594
    pict.height = 593
    await pict.save()
}
