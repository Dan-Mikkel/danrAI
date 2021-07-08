const ERROR_COLORS = {
  "5": "#ff0044",
  "4": "#e65c00",
  "3": "#809fff",
  "2": "#999999",
  "1": "#737373",
  "0": "#666666",
  highlight: "#ffff00"
};

export enum LogLevel {
  LOG_TRACE,
  LOG_DEBUG,
  LOG_INFO,
  LOG_WARN,
  LOG_ERROR,
  LOG_FATAL
}

export class Logger {
  public constructor() {
    this.info("Logger alive.", "Logger");
  }

  public get logLevel(): LogLevel {
    Memory.logLevel = Memory.logLevel || LogLevel.LOG_INFO;
    return Memory.logLevel;
  }

  private log(message: (() => string) | string, logLevel: LogLevel, source: string, highlight: boolean): void {
    if (logLevel < this.logLevel) return;
    const color: string = highlight ? ERROR_COLORS.highlight : ERROR_COLORS[logLevel];

    console.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `<log severity="${logLevel}"><span style="color:${color}">[${logLevel}] ${source} > ${message}</span></log>`
    );
  }

  public trace(message: (() => string) | string, source = "default", highlight = false): void {
    this.log(message, LogLevel.LOG_TRACE, source, highlight);
  }

  public debug(message: (() => string) | string, source = "default", highlight = false): void {
    this.log(message, LogLevel.LOG_DEBUG, source, highlight);
  }

  public info(message: (() => string) | string, source = "default", highlight = false): void {
    this.log(message, LogLevel.LOG_INFO, source, highlight);
  }

  public warn(message: (() => string) | string, source = "default", highlight = false): void {
    this.log(message, LogLevel.LOG_WARN, source, highlight);
  }

  public error(message: (() => string) | string, source = "default", highlight = false): void {
    this.log(message, LogLevel.LOG_ERROR, source, highlight);
  }

  public fatal(message: (() => string) | string, source = "default", highlight = false): void {
    this.log(message, LogLevel.LOG_FATAL, source, highlight);
  }
}
