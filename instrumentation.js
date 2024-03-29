const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// Configure the OTLP HTTP exporter
const otlpExporter = new OTLPTraceExporter({
    url: 'http://host.docker.internal:4318', 
  });

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: 'nodejs', 
});

const sdk = new NodeSDK({
  resource: resource,
  traceExporter: otlpExporter,
  spanProcessor: new BatchSpanProcessor(otlpExporter, {
    scheduledDelayMillis: 5000, // Adjust as needed
    maxQueueSize: 100, // Adjust based on your needs
    maxExportBatchSize: 10, // Adjust based on your needs
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

// Start the SDK
sdk.start();

console.log('Tracing initialized');

module.exports = sdk;
