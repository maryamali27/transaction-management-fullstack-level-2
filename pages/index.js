import { useState, useEffect } from 'react';
import { validateTransactionForm } from '../utils/validation.js';

export default function TransactionApp() {
  const [accountID, setAccountID] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial transactions
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    // Client-side validation
    const validation = validateTransactionForm(accountID, parseInt(amount));
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id: accountID,
          amount: parseInt(amount)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit transaction');
      }

      const newTransaction = await response.json();
      
      // Update transactions list (newest first)
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Clear form fields
      setAccountID('');
      setAmount('');
      setErrors([]);

    } catch (error) {
      console.error('Error submitting transaction:', error);
      setErrors([error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Accounting App</h1>
      
      {/* Form for submitting transactions - MUST have exact data-type attributes */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="account-id" style={{ display: 'block', marginBottom: '5px' }}>
            Account ID (UUID):
          </label>
          <input
            id="account-id"
            data-type="account-id"
            type="text"
            value={accountID}
            onChange={(e) => setAccountID(e.target.value)}
            placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000"
            style={{ 
              width: '100%', 
              padding: '8px', 
              fontSize: '16px',
              border: errors.some(err => err.includes('Account ID')) ? '2px solid red' : '1px solid #ddd'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="amount" style={{ display: 'block', marginBottom: '5px' }}>
            Amount:
          </label>
          <input
            id="amount"
            data-type="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 100 or -50"
            style={{ 
              width: '100%', 
              padding: '8px', 
              fontSize: '16px',
              border: errors.some(err => err.includes('Amount')) ? '2px solid red' : '1px solid #ddd'
            }}
          />
        </div>
        
        {errors.length > 0 && (
          <div style={{ 
            backgroundColor: '#ffe6e6', 
            color: '#d00', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '15px'
          }}>
            <strong>Validation Errors:</strong>
            <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <input
          data-type="transaction-submit"
          type="submit"
          value={isLoading ? 'Submitting...' : 'Submit Transaction'}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isLoading ? '#ccc' : '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        />
      </form>

      {/* Transaction List */}
      <div>
        <h2>Transaction History</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <div>
            {transactions.map((transaction, index) => (
              <div
                key={transaction.transaction_id}
                data-type="transaction"
                data-account-id={transaction.account_id}
                data-amount={transaction.amount}
                data-balance={index === 0 ? transaction.balance : undefined} // Only show balance for the last (first in array) transaction
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  backgroundColor: index === 0 ? '#f0f0f0' : 'white' // Highlight last transaction
                }}
              >
                <strong>Account:</strong> {transaction.account_id}<br />
                <strong>Amount:</strong> {transaction.amount > 0 ? '+' : ''}{transaction.amount}<br />
                <strong>Date:</strong> {new Date(transaction.created_at).toLocaleString()}<br />
                {index === 0 && transaction.balance !== undefined && (
                  <>
                    <strong>Balance:</strong> {transaction.balance}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}