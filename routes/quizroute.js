import { Router } from "express";


/** import controllers */
import * as controller from '../controllers/quizControllers.js';

/** Questions Routes API */
const router = Router();
router.route('/questions')
        .get(controller.getQuestions) /** GET Request */
        .post(controller.insertQuestions) /** POST Request */
        .delete(controller.dropQuestions) /** DELETE Request */

router.route('/result')
        .get(controller.getResult)
        .post(controller.storeResult)
        .delete(controller.dropResult)

export default router;