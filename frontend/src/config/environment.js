// Environment Configuration Service
class EnvironmentConfig {
  constructor() {
    this.environment = import.meta.env.VITE_ENVIRONMENT || 'development';
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
  }

  get isDevelopment() {
    return this.environment === 'development';
  }

  get isProduction() {
    return this.environment === 'production';
  }

  get API_BASE_URL() {
    return this.apiUrl;
  }

  // API Endpoints
  get endpoints() {
    return {
      auth: {
        login: `${this.apiUrl}/auth/login`,
        register: `${this.apiUrl}/auth/register`,
        refresh: `${this.apiUrl}/auth/refresh`,
        logout: `${this.apiUrl}/auth/logout`
      },
      users: `${this.apiUrl}/users`,
      hospitals: `${this.apiUrl}/hospitals`,
      patients: `${this.apiUrl}/patients`,
      prescriptions: `${this.apiUrl}/prescriptions`,
      inventory: `${this.apiUrl}/inventory`,
      reports: `${this.apiUrl}/reports`
    };
  }

  // Logging configuration
  get logging() {
    return {
      enabled: this.isDevelopment,
      level: this.isDevelopment ? 'debug' : 'error'
    };
  }
}

export const config = new EnvironmentConfig();
export default config;