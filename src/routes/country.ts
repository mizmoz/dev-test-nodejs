import express from 'express';

import * as countryApi from '../api/country';

const router = express.Router();

router.get('/', countryApi.list);
router.put('/:name', countryApi.update);
router.delete('/:name', countryApi.destroy);

export default router;
