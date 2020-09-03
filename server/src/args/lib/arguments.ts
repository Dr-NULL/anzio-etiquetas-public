export class Arguments {
  public cmd: string[];
  public props: { [key: string]: string[] };

  public constructor() {
    // Remove first useless values
    const input: string[] = process.argv
    if (process.argv[0] === process.argv0) {
      input.shift()
      input.shift()
    }

    this.cmd = []
    this.props = {}

    let key: string
    let val: string[] = []
    for (let i = 0; i < input.length; i++) {
      if (input[i].match(/^-+/gi)) {
        if (!key) {
          this.cmd = val
        } else {
          this.props[key] = val
        }
        
        key = input[i].replace(/-+/gi, '')
        val = []
      } else {
        val.push(input[i])
      }
    }

    if (!key) {
      this.cmd = val
    } else if (!Object.keys(this.props).find(x => x == key)) {
      this.props[key] = val  
    }
  }

  public find(...name: string[]) {
    const keys = Object
      .keys(this.props)
      .map(x => x.toLowerCase())

    for (const item of name) {
      if (keys.find(x => x === item.toLowerCase())) {
        return true
      }
    }

    return false
  }

  public findValue(...name: string[]) {
    const keys = Object
      .keys(this.props)
      .map(x => x.toLowerCase())

    for (const item of name) {
      const key = keys.find(x => x === item.toLowerCase())
      if (key) {
        return this.props[key]
      }
    }

    return null
  }
}