import { Language } from '../models/language';

export async function loadLang() {
    let lan = new Language()
    lan.default = true
    lan.codigo = 'DEFAULT'
    lan.descripc = 'Por Defecto'
    await lan.save()

    lan = new Language()
    lan.codigo = 'chn-esp'
    lan.descripc = 'Mercado China - Español'
    await lan.save()

    lan = new Language()
    lan.codigo = 'chn-eng'
    lan.descripc = 'Mercado China - Inglés'
    await lan.save()

    lan = new Language()
    lan.codigo = 'chn-chn'
    lan.descripc = 'Mercado China - Chino'
    await lan.save()
}
