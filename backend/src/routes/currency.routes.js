import express from 'express';
import {
  createCurrency,
  getAllCurrencies,
  getActiveCurrencies,
  getCurrencyById,
  updateCurrency,
  deleteCurrency,
  setDefaultCurrency,
  getDefaultCurrency,
  initializeDefaultCurrencies,
  getOrganizationCurrencySettings
} from '../controllers/currency.controller.js';

const router = express.Router();

router.post('/initialize', initializeDefaultCurrencies);
router.post('/', createCurrency);
router.get('/', getAllCurrencies);
router.get('/active', getActiveCurrencies);
router.get('/:id', getCurrencyById);
router.put('/:id', updateCurrency);
router.delete('/:id', deleteCurrency);
router.post('/default', setDefaultCurrency);
router.get('/default/:organizationId/:moduleType', getDefaultCurrency);
router.get('/settings/:organizationId/:moduleType', getOrganizationCurrencySettings);

export default router;
