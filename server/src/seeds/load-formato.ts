import { Fuente } from '../models/fuente';
import { Formato } from '../models/formato';
import { FormatoText } from '../models/formato-text';
import { FormatoRect } from '../models/formato-rect';
import { Picture } from '../models/picture';
import { Printer } from '../models/printer';

import { CmdPrinter } from 'cmd-printer';

export async function loadFormato() {
  let pict = await Picture.findOne({ id: 1 })
  let fontChn = await Fuente.findOne({ fontFace: 'Ping-Fang' })
  let fontCod = await Fuente.findOne({ fontFace: 'Code-128' })
  let form = new Formato()
  form.codigo = 'chnsp01'
  form.descripc = 'subproductos china 01'
  form.width = 150
  form.height = 100
  await form.save()

  // Test Etiqueta
  let dot = { x: 0, y: 0 }
  let text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.x = 5
  text.y = 4
  text.width = 140
  text.height = 5
  text.fontSize = 10
  text.text = '冷冻牛杂 / Frozen Beef Ofal / Subproductos Congelado Bovino'
  await text.save()

  dot.x = 5
  dot.y = 9
  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.fontSize = 7
  text.x = dot.x
  text.y = dot.y
  text.width = 25
  text.height = 10.5
  text.text = '产品名:\nProduct Name:\nNombre Producto:'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.fontSize = 10
  text.x = 27
  text.y = 12
  text.width = 118
  text.height = 5
  text.text = '{ prod.det.chn-chn } / { prod.det.chn-eng } / { prod.det.chn-esp }'
  text.align = 'center'
  await text.save()

  let rect = new FormatoRect()
  rect.formato = form
  rect.x = 27
  rect.y = 9.5
  rect.width = 118
  rect.height = 10
  await rect.save()

  dot.x = 5
  dot.y = 22
  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.fontSize = 7
  text.x = dot.x
  text.y = dot.y
  text.width = 27
  text.height = 10.5
  text.text = '净重:\nNet Weigth:\nPeso Neto:'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.align = 'right'
  text.fontSize = 10
  text.x = dot.x + 27
  text.y = dot.y + 2.5
  text.width = 27
  text.height = 5
  text.text = '{ peso.neto } Kgs.'
  await text.save()

  dot.x = 5
  dot.y = 33
  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.fontSize = 7
  text.x = dot.x
  text.y = dot.y
  text.width = 27
  text.height = 10.5
  text.text = '毛重:\nGross Weight:\nPeso Bruto:'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.align = 'right'
  text.fontSize = 10
  text.x = dot.x + 27
  text.y = dot.y + 2.5
  text.width = 27
  text.height = 5
  text.text = '{ peso.bruto } Kgs.'
  await text.save()

  dot.x = 5
  dot.y = 44
  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.fontSize = 7
  text.x = dot.x
  text.y = dot.y
  text.width = 27
  text.height = 14
  text.text = '屠宰日期:\nSlaughter Date:\nFecha Faena:\n{ fecha.faena.day }/{ fecha.faena.month }/{ fecha.faena.year }'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.fontSize = 7
  text.x = 32
  text.y = 44
  text.width = 27
  text.height = 14
  text.text = '生产包装日期:\nProduction Date:\nFecha Producción:\n{ fecha.producc.day }/{ fecha.producc.month }/{ fecha.producc.year }'
  await text.save()

  dot.x = 5
  dot.y = 59
  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.fontSize = 7
  text.x = 5
  text.y = 59
  text.width = 27
  text.height = 14
  text.text = '保质期至:\nExpiration Date:\nFecha Vencimiento:\n{ fecha.vencim.day }/{ fecha.vencim.month }/{ fecha.vencim.year }'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.fontSize = 7
  text.x = 32
  text.y = 59
  text.width = 27
  text.height = 14
  text.text = '生产企业注册号:\nEstablishment Nro:\nEstablecimiento Nro:\nCL 10-26'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.fontSize = 7
  text.x = 64
  text.y = 22.5
  text.width = 18
  text.height = 7.5
  text.text = '批次号:\nCert.Lot - LC:'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.fontSize = 8
  text.x = 84
  text.y = 24.5
  text.width = 16
  text.height = 4
  text.text = '{ loteCertif }'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.fontSize = 7
  text.x = 64
  text.y = 31
  text.width = 36.5
  text.height = 19
  text.text =   '生产厂家 奥索尔诺肉类加工:\nProduced By - Elaborado por:\nFrigorífico de Osorno S.A\n'
              + 'Res. S.S. N° 633 del 24.12.90\ny N° 104 del 04.02.82'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.fontSize = 7
  text.x = 64
  text.y = 50.5
  text.width = 33
  text.height = 5
  text.text =   '原产地 Origin Origen:'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.fontSize = 7
  text.x = 64
  text.y = 56
  text.width = 75.5
  text.height = 7.5
  text.text =   '保持在摄氏零下18度冷冻 Keep Frozen -18°C Mantener Congelado -18°C\n'
              + '烹 调 后 食 用 - Cook Thoroughly - Consumir Cocido'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.fontSize = 7
  text.x = 105
  text.y = 20
  text.width = 19.5
  text.height = 11
  text.text =   '规格:\nSpecification:\nEspecificación:'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.fontSize = 10
  text.x = 123
  text.y = 23
  text.width = 20
  text.height = 5
  text.text =   '{ prod.fam }'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.fontSize = 7
  text.x = 105
  text.y = 32
  text.width = 37
  text.height = 15
  text.text =   '目的地 中华人民共和国:\nDestination - Destino:\n'
              + 'The Peoples Republic of China\nRepública Popular China'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.fontSize = 7
  text.x = 105
  text.y = 48
  text.width = 34
  text.height = 8
  text.text =   '奥索尔诺 / 湖大区 / 智利\n'
              + 'Osorno / Los Lagos / Chile'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontCod
  text.align = 'center'
  text.fontSize = 40
  text.x = 64
  text.y = 62.5
  text.width = 80
  text.height = 12.5
  text.text =   '{ barcode }'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.align = 'center'
  text.fontSize = 10
  text.x = 64
  text.y = 74
  text.width = 80
  text.height = 6
  text.text =   '{ barcode }'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontCod
  text.align = 'center'
  text.fontSize = 40
  text.x = 32
  text.y = 78
  text.width = 112
  text.height = 13.5
  text.text =   '{ contrato }{ prod.cod }{ fecha.producc.day }'
              + '{ fecha.producc.month }{ fecha.producc.year }{ peso.neto }'
  await text.save()

  text = new FormatoText()
  text.formato = form
  text.fuente = fontChn
  text.align = 'center'
  text.fontSize = 10
  text.x = 32
  text.y = 91
  text.width = 111
  text.height = 5
  text.text =   '{ contrato }{ prod.cod }{ fecha.producc.day }'
              + '{ fecha.producc.month }{ fecha.producc.year }{ peso.neto }'
  await text.save()
  
  // Agregar halal
  await form.addPicture(pict.id, 5, 75, 20, 20)

  // Agregar Impresora
  const local = CmdPrinter.getByNameSync('Microsoft Print to PDF')
  const printer = new Printer()
  printer.name = local.name
  printer.formato = form
  await printer.save()
}
