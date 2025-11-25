// Global in-memory storage module
class InMemoryStorage {
  constructor() {
    if (!global.transactions) {
      global.transactions = [];
    }
    if (!global.accounts) {
      global.accounts = new Set();
    }
    
    this.transactions = global.transactions;
    this.accounts = global.accounts;
  }

  // Get all transactions (newest first)
  getAllTransactions() {
    return [...this.transactions].reverse();
  }

  // Get transaction by ID
  getTransactionById(transaction_id) {
    return this.transactions.find(t => t.transaction_id === transaction_id);
  }

  // Get account balance
  getAccountBalance(account_id) {
    return this.transactions
      .filter(t => t.account_id === account_id)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  // Get account by ID (check if exists)
  getAccountById(account_id) {
    const hasTransactions = this.transactions.some(t => t.account_id === account_id);
    return hasTransactions ? { account_id } : null;
  }

  // Create transaction
  createTransaction(account_id, amount) {
    // Generate transaction ID
    const transaction_id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });

    const timestamp = new Date().toISOString();

    // Add to accounts set
    this.accounts.add(account_id);

    // Create transaction
    const transaction = {
      transaction_id,
      account_id,
      amount,
      created_at: timestamp
    };

    // Add to transactions
    this.transactions.push(transaction);

    // Calculate current balance
    const currentBalance = this.getAccountBalance(account_id);

    return {
      ...transaction,
      balance: currentBalance
    };
  }
}

export default new InMemoryStorage();