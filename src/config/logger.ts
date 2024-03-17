import winston from "winston"

export default winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { serviceName: "auth" },
  transports: [
    new winston.transports.Console({
      level: "info",
      silent: false,
    }),
  ],
})
