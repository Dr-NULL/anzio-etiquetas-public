import { createConnection, Connection } from 'typeorm';
import { sleep } from '../tool/time';
import { Log } from '../tool/log';

export async function configTypeORM() {
  return new Promise<Connection>(resolve => {
    const func = () => {
      createConnection()
        .then(conn => {
          // Conexión establecida
          resolve(conn)
        })
        .catch(async err => {
          // Error de conexión
          Log.er(err.message)
          Log.ln('Reintentando en 5 seg...\n')
          
          await sleep(5000)
          func()
        })
    }

    // Iniciar conexión
    func()
  })
}