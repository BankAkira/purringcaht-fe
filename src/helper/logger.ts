/* eslint-disable */
const envMode = import.meta.env.MODE;

export enum LogLevel {
  Off = 0,
  Error,
  Warning,
  Info,
  Debug,
}

export type LogOutput = (
  source: string | undefined,
  level: LogLevel,
  ...objects: any[]
) => void;

export class Logger {
  static level = LogLevel.Debug;

  static outputs: LogOutput[] = [];

  static enableProductionMode() {
    Logger.level = LogLevel.Warning;
  }

  constructor(private source?: string) {}

  debug(...objects: any[]) {
    this.log(console.log, LogLevel.Debug, objects, 'yellow');
  }

  info(...objects: any[]) {
    this.log(console.info, LogLevel.Info, objects, 'lime');
  }

  warn(...objects: any[]) {
    this.log(console.warn, LogLevel.Warning, objects);
  }

  error(...objects: any[]) {
    this.log(console.error, LogLevel.Error, objects);
  }

  private log(
    func: (...args: any[]) => void,
    level: LogLevel,

    objects: any[],
    color?: string
  ) {
    if (
      level <= Logger.level &&
      (envMode === 'development' || envMode === 'trydev')
    ) {
      let log = this.source
        ? ['[' + this.source + ']'].concat(objects)
        : objects;

      if (color) {
        log = this.source
          ? [
              `%c[${this.source}]%c`,
              `background-color: ${color}; color: black; padding: 2px; margin: 2px 0; border-radius: 2px;`,
              '',
            ]
          : [];
        log.push(...objects);
      }

      func.apply(console, log);
      Logger.outputs.forEach(output =>
        output.apply(output, [this.source, level, ...objects])
      );
    }
  }
}
