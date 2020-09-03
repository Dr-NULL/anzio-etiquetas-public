import { Meta } from './meta';
import { Error } from './error';

export { Meta };
export { Error };

export interface Http<T = any> {
  data?: T;
  error?: Error;
  meta: Meta;
}
