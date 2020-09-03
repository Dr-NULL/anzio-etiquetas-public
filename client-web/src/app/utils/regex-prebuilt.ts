import { Regex } from './regex';

export function regEmail(strict: boolean = false) {
  let expr = '[a-z0-9]+([-+._][a-z0-9]+){0,2}@.*?(\\.(a'
    + '(?:[cdefgilmnoqrstuwxz]|ero|(?:rp|si)a)|b(?:[abde'
    + 'fghijmnorstvwyz]iz)|c(?:[acdfghiklmnoruvxyz]|at|o'
    + '(?:m|op))|d[ejkmoz]|e(?:[ceghrstu]|du)|f[ijkmor]|'
    + 'g(?:[abdefghilmnpqrstuwy]|ov)|h[kmnrtu]|i(?:[delm'
    + 'noqrst]|n(?:fo|t))|j(?:[emop]|obs)|k[eghimnprwyz]'
    + '|l[abcikrstuvy]|m(?:[acdeghklmnopqrstuvwxyz]|il|o'
    + 'bi|useum)|n(?:[acefgilopruz]|ame|et)|o(?:m|rg)|p('
    + '?:[aefghklmnrstwy]|ro)|qa|r[eosuw]|s[abcdeghijklm'
    + 'nortuvyz]|t(?:[cdfghjklmnoprtvwz]|(?:rav)?el)|u[a'
    + 'gkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw])\\b){1,2}';

  if (strict) {
    expr = '^' + expr + '$';
  }

  return new Regex(expr, 'gi');
}
