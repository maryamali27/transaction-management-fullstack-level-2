import storage from '../../../utils/storage.js';
import { isValidUUID } from '../../../utils/validation.js';

export default function handler(req, res) {
  const { account_id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!account_id || !isValidUUID(account_id)) {
    return res.status(400).json({ error: 'Invalid account_id format' });
  }

  const account = storage.getAccountById(account_id);
  
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  const balance = storage.getAccountBalance(account_id);

  res.status(200).json({
    account_id,
    balance
  });
}