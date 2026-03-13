const LOG_PREFIX = '[JRPG]';

const formatMeta = (meta: readonly unknown[]): readonly unknown[] => {
  return meta.length > 0 ? meta : [];
};

export const logger = {
  info(message: string, ...meta: readonly unknown[]): void {
    if (import.meta.env.DEV) {
      console.info(LOG_PREFIX, message, ...formatMeta(meta));
    }
  },

  warn(message: string, ...meta: readonly unknown[]): void {
    console.warn(LOG_PREFIX, message, ...formatMeta(meta));
  },

  error(message: string, ...meta: readonly unknown[]): void {
    console.error(LOG_PREFIX, message, ...formatMeta(meta));
  },
};
