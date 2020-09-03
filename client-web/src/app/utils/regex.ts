export interface IRegExprIteration {
  pattern: RegExp;
  callback: (data?: string[]) => void;
}

export class Regex {
  private self: RegExp;
  public constructor(pattern: string | RegExp, flags?: string) {
    this.self = new RegExp(pattern, flags);

  }

  public static switch(input: string, ...search: IRegExprIteration[]) {
    for (const iteration of search) {
      const inst = new Regex(iteration.pattern);
      const data = inst.matchIn(input);

      if (data.length > 0) {
        iteration.callback(data);
        return true;
      }
    }

    return false;
  }

  public matchIn(source: string) {
    const collector = source.match(this.self);
    if (collector == null) {
      return [];
    } else {
      const data: string[] = [];
      data.push(...collector);

      return data;
    }
  }

  public replaceIn(source: string, replace: string) {
    return source.replace(this.self, replace);
  }
}
