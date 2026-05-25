import express from 'express';
import { createTender, getAllTenders, getTender, updateTender, deleteTender } from '../../controllers/ngo/tender.controller.js';

const router = express.Router();

router.post('/', createTender);
router.get('/', getAllTenders);
router.get('/:id', getTender);
router.put('/:id', updateTender);
router.delete('/:id', deleteTender);

export default router;
