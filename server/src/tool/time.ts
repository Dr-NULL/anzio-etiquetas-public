export class Loop {
  private _isRunning: boolean;
  public get isRunning(): boolean {
    return this._isRunning;
  }

  private _ms : number;
  public get ms() : number {
    return this._ms;
  }
  public set ms(v : number) {
    this._ms = v;
  }
  
  private _callback : () => void | Promise<void>;
  public get callback() : () => void | Promise<void> {
    return this._callback;
  }
  public set callback(v : () => void | Promise<void>) {
    this._callback = v;
  }
  
  public constructor(ms?: number, callback?: () => void | Promise<void>) {
    this._isRunning = false
    if (ms != null) {
      this._ms = ms
    }

    if (callback != null) {
      this._callback = callback 
    }
  }

  public start() {
    this._isRunning = true

    return new Promise<void>((resolve, reject) => {
      if (
        (this._ms != null) &&
        (this._callback != null)
      ) {
        let error: Error
        const exec = () => {
          setTimeout(async () => {
            if (!this._isRunning) {
              resolve()
            } else {
              try {
                // Execute Callback
                if (this.isPromise()) {
                  await this._callback()
                } else {
                  this._callback()
                }
  
                // Recursive execution
                exec()
              } catch (err) {
                this._isRunning = false;
                reject(err)
              }
            }
          }, this._ms);
        }

        // Initialize
        exec()
      }
    })
  }

  stop() {
    this._isRunning = false
  }

  private isPromise() {
    if (this._callback == null) {
      return false
    } else if (Object.getPrototypeOf(this._callback).constructor.name == 'AsyncFunction') {
      return true
    } else {
      return false
    }
  }
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms);
  })
}