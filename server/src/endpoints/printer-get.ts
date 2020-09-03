import { CmdPrinter } from 'cmd-printer';
import { EndPoint } from '../tool/end-point';
import { Printer } from '../models/printer';
import { ValidateRequest } from '../tool/validate-request';

export const PRINTER_GET = new EndPoint()
PRINTER_GET.method = 'get'
PRINTER_GET.path = 'printer/get'
PRINTER_GET.callback = async (req, res) => {
  const validate = new ValidateRequest(req, res)
  if (
    (!validate.checkSession()) ||
    (!await validate.checkPath())
  ) {
    return
  }

  const data = CmdPrinter.getAllSync()
  const out: Printer[] = []

  for (let item of data) {
    const obj = new Printer()
    obj.name = item.name
    out.push(obj)
  }

  res.apiRest.send(out)
}
