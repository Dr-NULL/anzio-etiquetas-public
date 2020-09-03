import { ProductoDet } from '../models/producto-det';
import { Producto } from '../models/producto';
import { Language } from '../models/language';
import { Familia } from '../models/familia';
import '../tool/capitalize';

export async function loadProducto() {
  //--------------------------------------
  await setLang(
    'SP0654',
    'chn-esp',
    'LIGAMENTO NUCAL'
  )
  await setLang(
    'SP0654',
    'chn-chn',
    '牛板筋'
  )
  await setLang(
    'SP0654',
    'chn-eng',
    'BACK STRAP'
  )

  //--------------------------------------
  await setLang(
    'SP2010',
    'chn-esp',
    'CHARCHA CORRIENTE (LABIO)'
  )
  await setLang(
    'SP2010',
    'chn-chn',
    '牛唇'
  )
  await setLang(
    'SP2010',
    'chn-eng',
    'LIPS'
  )

  //--------------------------------------
  await setLang(
    'SP2015',
    'chn-esp',
    'CHARCHA CACHETE'
  )
  await setLang(
    'SP2015',
    'chn-chn',
    '牛脸肉'
  )
  await setLang(
    'SP2015',
    'chn-eng',
    'CHEEK MEAT'
  )

  //--------------------------------------
  await setLang(
    'SP2021',
    'chn-esp',
    'CORAZON DESGRASADO'
  )
  await setLang(
    'SP2021',
    'chn-chn',
    '牛心'
  )
  await setLang(
    'SP2021',
    'chn-eng',
    'HEART'
  )

  //--------------------------------------
  await setLang(
    'SP2910',
    'chn-esp',
    'TENDONES DE MANOS Y PIERNAS'
  )
  await setLang(
    'SP2910',
    'chn-chn',
    '牛蹄筋'
  )
  await setLang(
    'SP2910',
    'chn-eng',
    'TENDON'
  )

  //--------------------------------------
  await setLang(
    'SP2029',
    'chn-esp',
    'VERGAS'
  )
  await setLang(
    'SP2029',
    'chn-chn',
    '牛鞭'
  )
  await setLang(
    'SP2029',
    'chn-eng',
    'PIZZLE'
  )

  //--------------------------------------
  await setLang(
    'SP2070',
    'chn-esp',
    'LENGUA'
  )
  await setLang(
    'SP2070',
    'chn-chn',
    '牛舌'
  )
  await setLang(
    'SP2070',
    'chn-eng',
    'SWISS CUT TONGUE'
  )

  //--------------------------------------
  await setLang(
    'SP2145',
    'chn-esp',
    'AORTA DE VACUNO'
  )
  await setLang(
    'SP2145',
    'chn-chn',
    '牛心管'
  )
  await setLang(
    'SP2145',
    'chn-eng',
    'AORTA'
  )

  //--------------------------------------
  await setLang(
    'SP2500',
    'chn-esp',
    'COLAS'
  )
  await setLang(
    'SP2500',
    'chn-chn',
    '牛尾'
  )
  await setLang(
    'SP2500',
    'chn-eng',
    'OX TAIL'
  )

  //--------------------------------------
  await setLang(
    'SP2510',
    'chn-esp',
    'POLLO BARRIGA'
  )
  await setLang(
    'SP2510',
    'chn-chn',
    '厚裙边'
  )
  await setLang(
    'SP2510',
    'chn-eng',
    'THICK SKIRT( HANGING TENDER)'
  )

  //--------------------------------------
  await setLang(
    'SP3000',
    'chn-esp',
    'TELA DIAFRAGMA'
  )
  await setLang(
    'SP3000',
    'chn-chn',
    '牛横膈膜'
  )
  await setLang(
    'SP3000',
    'chn-eng',
    'DIAPHRAGM'
  )
}

async function setLang(codProd: string, codLang: string, descripc: string) {
  let lan = await Language.findOne({ codigo: codLang })
  let prd = await Producto.findOne({ codigo: codProd })
  let fam = await Familia.findOne({ codigo: 'SP' })
  
  // Crear detalle
  let det = new ProductoDet()
  det.language = lan
  det.descripc = descripc

  // Crear Producto
  if (prd == null) {
    prd = new Producto()
    prd.codigo = codProd
    prd.familia = fam
    await prd.save()
  }
  det.producto = prd
  await det.save()

  // Crear default
  if (codLang.match(/esp/gi)) {
    det = new ProductoDet()
    det.producto = prd
    det.descripc = descripc.capitalize()
    det.language = await Language.findOne({ codigo: 'DEFAULT' })

    await det.save()
  }
}
