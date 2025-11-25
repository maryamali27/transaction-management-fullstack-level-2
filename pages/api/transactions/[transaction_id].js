import storage from '../../../utils/storage.js';
import { isValidUUID } from '../../../utils/validation.js';

export default function handler(req, res) {
  const { transaction_id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!transaction_id || !isValidUUID(transaction_id)) {
    return res.status(400).json({ error: 'Invalid transaction_id format' });
    }

  const transaction = storage.getTransactionById(transaction_id);

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  res.status(200).json(transaction);
}