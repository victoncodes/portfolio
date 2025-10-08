import { Router } from 'express';
import { TransactionController } from '@/controllers/transaction.controller';
import { validate, schemas } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';

const router = Router();
const transactionController = new TransactionController();

// All transaction routes require authentication
router.use(authenticateToken);

router.post('/', validate(schemas.transaction), transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.get('/stats', transactionController.getTransactionStats);
router.get('/:id', transactionController.getTransaction);
router.put('/:id', validate(schemas.transaction), transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

export default router;