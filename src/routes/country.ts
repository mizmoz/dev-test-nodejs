import express from 'express';
import { getCountry, updateCountry, deleteCountry } from '../api/country';
import checkAuth from '../middlewares/check-auth';

const router = express.Router();

router.get('/', checkAuth, getCountry);
router.post('/', checkAuth, updateCountry);
router.delete('/:code', checkAuth, deleteCountry);

export default router;
