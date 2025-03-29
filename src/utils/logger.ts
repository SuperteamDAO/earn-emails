import { Axiom } from '@axiomhq/js';

const axiom = new Axiom({
  token: process.env.AXIOM_TOKEN || '',
});

const DATASET_NAME = 'earn-emails';

export const logError = async (
  error: Error,
  context: Record<string, any> = {},
) => {
  try {
    await axiom.ingest(DATASET_NAME, [
      {
        level: 'error',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        ...context,
        _service: 'earn-emails',
        _environment: process.env.SERVER_ENV || 'development',
      },
    ]);
  } catch (err) {
    console.error('Failed to send error log to Axiom:', err);
  }
};

export const logInfo = async (
  message: string,
  context: Record<string, any> = {},
) => {
  try {
    await axiom.ingest(DATASET_NAME, [
      {
        level: 'info',
        message,
        timestamp: new Date().toISOString(),
        ...context,
        _service: 'earn-emails',
        _environment: process.env.SERVER_ENV || 'development',
      },
    ]);
  } catch (err) {
    console.error('Failed to send info log to Axiom:', err);
  }
};

export const logWarn = async (
  message: string,
  context: Record<string, any> = {},
) => {
  try {
    await axiom.ingest(DATASET_NAME, [
      {
        level: 'warn',
        message,
        timestamp: new Date().toISOString(),
        ...context,
        _service: 'earn-emails',
        _environment: process.env.SERVER_ENV || 'development',
      },
    ]);
  } catch (err) {
    console.error('Failed to send warning log to Axiom:', err);
  }
};
