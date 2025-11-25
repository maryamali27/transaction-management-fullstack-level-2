import storage from '../../utils/storage.js';
import { isValidUUID } from '../../utils/validation.js';

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Check content type for 415 error
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({ error: 'Content-Type must be application/json' });
    }

    const { account_id, amount } = req.body;

    // Validate required fields
    if (!account_id || typeof account_id !== 'string' || !isValidUUID(account_id)) {
      return res.status(400).json({ error: 'Invalid account_id format' });
    }

    if (typeof amount !== 'number' || !Number.isInteger(amount)) {
      return res.status(400).json({ error: 'Invalid amount format' });
    }

    try {
      // Create transaction
      const newTransaction = storage.createTransaction(account_id, amount);

      res.status(201).json(newTransaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    // Return all transactions, newest first
    const transactions = storage.getAllTransactions();
    res.status(200).json(transactions);
  } else if (req.method === 'PUT' || req.method === 'DELETE' || req.method === 'PATCH') {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({ error: 'Content-Type must be application/json' });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}