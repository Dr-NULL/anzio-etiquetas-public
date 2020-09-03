import { EndPoint } from './tool/end-point';

import { TEST } from './endpoints/test';
import { FUENTE_GET } from './endpoints/fuente-get';
import { FORMATO_GET } from './endpoints/formato-get';
import { FORMATO_ADD } from './endpoints/formato-add';
import { FORMATO_UPDATE } from './endpoints/formato-update';
import { PICTURE_FILE } from './endpoints/picture-file';
import { PICTURE_GET } from './endpoints/picture-get';
import { PICTURE_ADD } from './endpoints/picture-add';
import { PRODUCTO_GET } from './endpoints/producto-get';
import { PRODUCTO_SET_DETAIL } from './endpoints/producto-set-detail';
import { PRINTER_GET } from './endpoints/printer-get';
import { FORMATO_DEL } from './endpoints/formato-del';
import { FORMATO_GET_PRINTERS } from './endpoints/formato-get-printers';
import { FORMATO_SET_PRINTERS } from './endpoints/formato-set-printers';
import { FORMATO_GET_CONFIG } from './endpoints/formato-get-config';
import { FORMATO_SET_CONFIG } from './endpoints/formato-set-config';
import { LANGUAGE_ADD } from './endpoints/language-add';
import { LANGUAGE_GET } from './endpoints/language-get';
import { LANGUAGE_SET } from './endpoints/language-set';
import { LANGUAGE_DEL } from './endpoints/language-del';
import { PAIS_GET } from './endpoints/pais-get';
import { USUARIO_CHK_SYSTEM } from './endpoints/usuario-chk-system';
import { USUARIO_ADD_QUEUE } from './endpoints/usuario-add-queue';
import { USUARIO_ADD_QUEUE_SYSTEM } from './endpoints/usuario-add-queue-system';
import { USUARIO_GET_SESSION } from './endpoints/usuario-get-session';
import { USUARIO_GET_QUEUE } from './endpoints/usuario-get-queue';
import { USUARIO_LOGIN } from './endpoints/usuario-login';
import { USUARIO_LOGOUT } from './endpoints/usuario-logout';
import { USUARIO_TIPO_GET } from './endpoints/usuario-tipo-get';
import { USUARIO_GET } from './endpoints/usuario-get';
import { USUARIO_ADD } from './endpoints/usuario-add';
import { USUARIO_SET } from './endpoints/usuario-set';
import { USUARIO_DISABLE } from './endpoints/usuario-disable';
import { USUARIO_DEL_QUEUE } from './endpoints/usuario-del-queue';

export const ROUTES: EndPoint[] = [
  TEST,
  PAIS_GET,
  FUENTE_GET,
  FORMATO_ADD,
  FORMATO_GET,
  FORMATO_DEL,
  FORMATO_GET_PRINTERS,
  FORMATO_SET_PRINTERS,
  FORMATO_GET_CONFIG,
  FORMATO_SET_CONFIG,
  FORMATO_UPDATE,
  PICTURE_FILE,
  PICTURE_GET,
  PICTURE_ADD,
  LANGUAGE_ADD,
  LANGUAGE_GET,
  LANGUAGE_SET,
  LANGUAGE_DEL,
  PRODUCTO_GET,
  PRODUCTO_SET_DETAIL,
  PRINTER_GET,
  USUARIO_CHK_SYSTEM,
  USUARIO_ADD_QUEUE,
  USUARIO_ADD_QUEUE_SYSTEM,
  USUARIO_GET_SESSION,
  USUARIO_GET_QUEUE,
  USUARIO_LOGIN,
  USUARIO_LOGOUT,
  USUARIO_TIPO_GET,
  USUARIO_GET,
  USUARIO_ADD,
  USUARIO_SET,
  USUARIO_DISABLE,
  USUARIO_DEL_QUEUE
]