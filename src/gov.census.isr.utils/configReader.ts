import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.uat' });

export class ConfigReader {
  private static getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}. Check your .env file.`);
    }
    return value;
  }

  static getBaseUrl(): string {
    return ConfigReader.getEnvVar('BASE_URL');
  }

  static getValidCensusId(): string {
    return ConfigReader.getEnvVar('CENSUS_ID_VALID');
  }

  static getInvalidCensusId(): string {
    return ConfigReader.getEnvVar('CENSUS_ID_INVALID');
  }

  static getWarningMessage(): string {
    return ConfigReader.getEnvVar('WARNING_MESSAGE');
  }
}
