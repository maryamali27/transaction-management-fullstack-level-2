// UUID validation utility
export const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Amount validation utility
export const isValidAmount = (amount) => {
  return typeof amount === 'number' && Number.isInteger(amount);
};

// Form validation utility
export const validateTransactionForm = (account_id, amount) => {
  const errors = [];
  
  if (!account_id || typeof account_id !== 'string') {
    errors.push('Account ID is required');
  } else if (!isValidUUID(account_id)) {
    errors.push('Account ID must be a valid UUID');
  }
  
  if (amount === '' || amount === null || amount === undefined) {
    errors.push('Amount is required');
  } else if (!Number.isInteger(Number(amount))) {
    errors.push('Amount must be an integer');
  } else if (isNaN(Number(amount))) {
    errors.push('Amount must be a valid number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};