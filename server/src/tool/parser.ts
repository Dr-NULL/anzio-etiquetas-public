export class Parser {
  private rawValue: string;
  public get value(): string {
    return this.rawValue;
  }
  public set value(v: string) {
    if (v == null) {
      this.rawValue = '';
    } else if (typeof v !== 'string') {
      this.rawValue = `${v}`;
    } else {
      this.rawValue = v;
    }
  }

  private rawSepInt: string;
  public get sepInt(): string {
    return this.rawSepInt;
  }
  public set sepInt(v: string) {
    if (v.length > 0) {
      this.rawSepInt = v.substr(0, 1);
    } else {
      this.rawSepInt = null;
    }
  }

  private rawSepDec: string;
  public get sepDec(): string {
    return this.rawSepDec;
  }
  public set sepDec(v: string) {
    if (v.length > 0) {
      this.rawSepDec = v.substr(0, 1);
    } else {
      this.rawSepDec = null;
    }
  }

  public constructor(input: string | number = null) {
    if (input == null) {
      input = '';
    }

    this.rawValue = String(input);
    this.rawSepInt = null;
    this.rawSepDec = '.';
  }

  public getInt(min?: number, max?: number) {
    const rejex = this.rawValue.match(/(^-[0-9]+|[0-9]+)/gi);
    if (rejex == null) {
      return 0;
    }

    const procc = parseInt(rejex[0], 10);
    if (
      (max != null) &&
      (max < procc)
    ) {
      return max;
    } else if (
      (min != null) &&
      (min > procc)
    ) {
      return min;
    } else {
      return procc;
    }
  }

  public getFloat(dec?: number, min?: number, max?: number) {
    const rejex = this.rawValue.match(/(^-[0-9]+|[0-9]+)/gi);
    if (rejex == null) {
      return 0;
    }

    const procc = parseFloat(rejex.reduce((prev, curr, i) => {
      if (i === 0) {
        return curr;
      } else if (
        (i <= 1) &&
        (dec == null)
      ) {
        return prev + '.' + curr;
      } else if (
        (i <= 1) &&
        (dec != null)
      ) {
        return prev + '.' + curr.substr(0, dec);
      } else {
        return prev;
      }
    }, ''));

    if (
      (max != null) &&
      (max < procc)
    ) {
      return max;
    } else if (
      (min != null) &&
      (min > procc)
    ) {
      return min;
    } else {
      return procc;
    }
  }
  
  get isNumeric(): boolean {
    if (this.rawValue.match(/(^(\+|-)?[0-9]+(\.|,)[0-9]+$|^(\+|-)?[0-9]+(\.|,)?$)/gi) != null) {
      return true;
    } else {
      return false;
    }
  }

  getFormat(dec?: number, min?: number, max?: number) {
    const match = this.getFloat(dec, min, max)
      .toString()
      .match(/(\+|-)?[0-9]+/gi);

    // Format Integer
    let out: string;
    if (this.rawSepInt == null) {
      out = match[0];
    } else {
      out = '';
      match[0]
        .split('')
        .reverse()
        .forEach((ch, i) => {
          if (
            (i != 0) &&
            (i % 3 == 0) &&
            (this.rawSepInt != null)
          ) {
            // Add mile separator
            out = this.rawSepInt + out;
          }
          // Add character
          out = ch + out;
        });
    }

    // Format Float
    if (
      (dec > 0) &&
      (this.rawSepDec != null)
    ) {
      out += this.rawSepDec;
      if (match[1] == null) {
        match.push('');
      }

      // Fix Length
      if (match[1].length > dec) {
        match[1] = match[1].substr(0, dec);
      } else {
        while (match[1].length < dec) {
          match[1] += '0';
        }
      }

      out += match[1];
    }

    return out;
  }
}
