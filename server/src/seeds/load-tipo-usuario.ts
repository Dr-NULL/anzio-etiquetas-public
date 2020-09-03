import { UsuarioTipo } from '../models/usuario-tipo';

export async function loadTipoUsuarios() {
  let tipo = new UsuarioTipo()
  tipo.rango = 0
  tipo.nombre = 'System'
  tipo.descripc = 'Usuario con los privilegios máximos en el sistema.'
  await tipo.save()

  tipo = new UsuarioTipo()
  tipo.rango = 1
  tipo.nombre = 'Administrador'
  tipo.descripc = 'Usuario que tiene las facultades para gestionar todo el sistema.'
  await tipo.save()

  tipo = new UsuarioTipo()
  tipo.rango = 2
  tipo.nombre = 'Supervisor'
  tipo.descripc = 'Usuario que puede reimprimr etiquetas, y diseñarlas.'
  await tipo.save()
}