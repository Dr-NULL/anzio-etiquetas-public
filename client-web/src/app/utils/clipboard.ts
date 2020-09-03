export class Clipboard {
  public static copyText(text: string) {
    return new Promise<void>((resolve) => {
      const listener = (ev: ClipboardEvent) => {
        ev.preventDefault();
        ev.clipboardData.setData('text/plain', text);

        resolve();
      };

      document.addEventListener('copy', listener, false);
      document.execCommand('copy');
      document.removeEventListener('copy', listener, false);
    });
  }

  public static pasteText() {
    return new Promise<string>((resolve) => {
      const listener = (ev: ClipboardEvent) => {
        ev.preventDefault();
        const data = ev.clipboardData.getData('text/plain');

        resolve(data);
      };

      document.addEventListener('paste', listener, false);
      document.execCommand('paste');
      document.removeEventListener('paste', listener, false);
    });
  }
}