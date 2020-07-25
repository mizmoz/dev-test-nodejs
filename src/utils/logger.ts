import { createLogger, format, transports } from "winston";
import { config } from "../config";

const { combine, timestamp, printf } = format;

const loggerFormat = printf((info: any) => {
  return `${info.timestamp} | ${info.level}: ${info.message}`;
});

export const logger = createLogger({
  level: config.loggerLevel,
  format: combine(format.colorize(), timestamp(), loggerFormat),
  transports: [new transports.Console()],
});
