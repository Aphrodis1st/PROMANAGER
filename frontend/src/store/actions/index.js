/**
 * Side-effect imports register all RTK Query endpoints on baseAPI.
 * Import hooks from individual action modules in components.
 */
import './auth.js';
import './pharmacy.js';
import './stock.js';
import './production.js';
import './hr.js';
import './property.js';
import './hospital.js';
import './hospitalAdmin.js';
import './hospitalReports.js';
import './superAdmin.js';
import './ngo.js';
import './currency.js';

export { default as authApi } from './auth.js';
export { default as pharmacyApi } from './pharmacy.js';
export { default as stockApi } from './stock.js';
export { default as productionApi } from './production.js';
export { default as hrApi } from './hr.js';
export { default as propertyApi } from './property.js';
export { default as hospitalApi } from './hospital.js';
export { default as hospitalAdminApi } from './hospitalAdmin.js';
export { default as hospitalReportsApi } from './hospitalReports.js';
export { default as superAdminApi } from './superAdmin.js';
export { default as ngoApi } from './ngo.js';
export { default as currencyApi } from './currency.js';
