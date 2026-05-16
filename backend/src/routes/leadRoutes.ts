import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from '../controllers/leadController';
import { protect, authorize } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { createLeadSchema, updateLeadSchema } from '../validators/leadValidator';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(validate(createLeadSchema), createLead)
  .get(getLeads);

router
  .route('/:id')
  .get(getLeadById)
  .put(validate(updateLeadSchema), updateLead)
  .delete(authorize('Admin'), deleteLead);

export default router;
