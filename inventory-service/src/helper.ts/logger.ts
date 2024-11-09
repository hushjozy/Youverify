import winston from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";

const esTransportOpts = {
  level: "info",
  clientOpts: { node: "http://elasticsearch:9200" },
  indexPrefix: "inventory-logs",
};

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new ElasticsearchTransport(esTransportOpts),
  ],
});

export default logger;
