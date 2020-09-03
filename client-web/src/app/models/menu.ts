export class Menu {
  id: number;
  everyone: boolean;
  hidden: boolean;
  hideOnLogged: boolean;
  icon: string;
  text: string;
  path: string;
  children: Menu[];
}
