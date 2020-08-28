import * as express from 'express'

import { getAll, add, edit, remove } from '../controllers/countriesController'

const router = express.Router();

router.route('/').get(getAll).post(add).put(edit).delete(remove);


export default router
