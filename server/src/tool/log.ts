import chalk from 'chalk'
import './number-format';

export class Log {
  public static title(title: string, ver: string = '1.0.0') {
    // Color Palette
    const cOrange = chalk.keyword('orange').bold
    const cWhite = chalk.white.bold 
    const cGrey = chalk.grey

    console.clear()
    console.log(cGrey('<<------(( ') + cOrange(title) + cWhite(' v' + ver) + cGrey(' ))------>>\n'))
  }

  private static now() {
    const time = new Date()
    return  `${time.getHours().format(2)}:`
          + `${time.getMinutes().format(2)}:`
          + `${time.getSeconds().format(2)}`
  }

  private static write(color: chalk.Chalk, type: string, ...input: string[]) {
    const cClock = chalk.grey
    const text: string[] = []

    for (const item of input) {
      text.push(...item.split(/\n/gi))
    }

    console.log(
        cClock('[' + this.now() + ']') + ' '
      + color(type)
      + ': '
      + text.shift()
    )

    this.ln(...text)
  }

  public static ln(...input: string[]) {
    const text: string[] = []
    for (const item of input) {
      text.push(...item.split(/\n/gi))
    }

    for (const item of text) {
      console.log(
          '                    '
        + item
      )
    }
  }

  public static ev(...input: string[]) {
    const cType = chalk.white.bgKeyword('orange').bold
    this.write(cType, ' EVENT ', ...input)
  }

  public static ok(...input: string[]) {
    const cType = chalk.white.bgKeyword('green').bold
    this.write(cType, 'SUCCESS', ...input)
  }

  public static er(...input: string[]) {
    const cType = chalk.white.bgKeyword('red').bold
    this.write(cType, ' ERROR ', ...input)
  }

  public static sep() {
    console.log(chalk.grey(
        `-----------------------------------------`
      + `----------------------------------------\n`
    ))
  }
}