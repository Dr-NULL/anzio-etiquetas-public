import { createConnection } from 'typeorm';
import { Log } from '../tool/log';

export async function loadSeeds(data: Array<() => Promise<void>>) {
    try {
        console.clear()
        Log.ev('conectando a DB...')
        await createConnection()
        
        Log.ok('Conexión exitosa!\n')
        Log.ev('Iniciando carga de datos:')
        Log.ln('↓↓↓    ↓↓↓    ↓↓↓')

        for (const callback of data) {
            Log.ln('execute -> "' + callback.name + '();"')
            await callback()
        }

        Log.ln('↑↑↑    ↑↑↑    ↑↑↑')
        Log.ok('Carga completada!')
    } catch (err) {
        Log.er('Error en la carga de datos!')
        Log.ln(err.message)
    } finally {
        process.exit()
    }
}