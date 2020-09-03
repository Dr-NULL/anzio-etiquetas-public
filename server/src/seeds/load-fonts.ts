import { Fuente } from '../models/fuente';

export async function loadFuentes() {
    let font = new Fuente()
    font.nombre = 'Chino Simplificado'
    font.fontFace = 'Ping-Fang'
    font.filename = 'PingFang.ttf'
    await font.save()
    
    font = new Fuente()
    font.nombre = 'Code 128'
    font.fontFace = 'Code-128'
    font.filename = 'Code128.ttf'
    await font.save()
}
