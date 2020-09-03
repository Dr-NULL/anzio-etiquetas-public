import { Arguments } from './arguments';
import { checker } from '../../tool/checker';
import { Log } from '../../tool/log';

export class Endpoint {
  public cmd: string[] = [];
  public props: string[] = [];
  public callback: (args: Arguments) => any

  public static async router(data: Endpoint[]) {
    const args = new Arguments()
    for (const item of data) {
      // Search commands
      const cmdArgs = args.cmd.map(x => x = x.toLowerCase())
      const cmdRtng = item.cmd.map(x => x = x.toLowerCase())

      let foundCmd = true
      for (const cmd of cmdRtng) {
        if (!cmdArgs.find(x => x == cmd)) { 
          foundCmd = false
          break
        }
      }
      if (!foundCmd) {
        continue
      }
      
      // Search Parameter
      let foundProps = true
      const propsArgs = Object.keys(args.props).map(x => x = x.toLowerCase())
      if (checker(item.props) === 'Array') {
        for (const prop of item.props) {
          if (!propsArgs.find(x => x == prop.toLowerCase())) {
            foundProps = false
            break
          }
        }
      }

      if (foundCmd && foundProps) {
        try {
          switch(checker(item.callback)) {
            case 'AsyncFunction':
              await item.callback(args)
              break
            case 'Function':
              item.callback(args)
              break
          }
        } catch (err) {
          Log.er(err.message)
        }
        break
      }
    }
  }

  public constructor() {}
}