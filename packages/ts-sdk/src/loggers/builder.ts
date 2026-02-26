import pino from 'pino';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * LoggerBuilder
 * Provides a fluent API to assemble a Pino-based logger with standard and custom plugins.
 */
export class LoggerBuilder {
  private targets: any[] = [];

  /**
   * Configures standard pino-roll for rotating file streams.
   */
  with_rotating_files(config: { path: string; size?: string; interval?: string }) {
    this.targets.push({
      target: 'pino-roll',
      options: {
        file: config.path,
        size: config.size || '10m',
        interval: config.interval || '1d',
        mkdir: true
      },
      level: 'info'
    });
    return this;
  }

  /**
   * Dynamically loads a custom plugin from the local sdk directory.
   * Uses absolute paths to prevent resolution issues in different environments.
   */
  with_custom_plugin(pluginName: string, options: any) {
    // Navigate from src/loggers to src/loggers/plugins
    const pluginPath = join(__dirname, 'plugins', `${pluginName}.js`);
    
    this.targets.push({
      target: pluginPath,
      options: options
    });
    return this;
  }

  /**
   * Builds the finalized pino logger instance.
   */
  build() {
    const transport = pino.transport({
      targets: this.targets.length > 0 ? this.targets : [{
        target: 'pino/file',
        options: { destination: 2 } // Default to stderr
      }]
    });
    
    return pino(transport);
  }
}