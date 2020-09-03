export interface Error {
  status: number;
  title: string;
  details: string;
  source: {
    pointer: string;
    parameter?: any;
  };
}
