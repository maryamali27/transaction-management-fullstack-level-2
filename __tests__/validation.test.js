import { isValidUUID, isValidAmount, validateTransactionForm } from '../utils/validation.js';

describe('Validation Utilities', () => {
  describe('isValidUUID', () => {
    test('should return true for valid UUID', () => {
      const validUUID = '550e8400-e29b-41d4-a716-446655440000';
      expect(isValidUUID(validUUID)).toBe(true);
    });

    test('should return false for invalid UUID format', () => {
      const invalidUUID = 'invalid-uuid';
      expect(isValidUUID(invalidUUID)).toBe(false);
    });

    test('should return false for empty string', () => {
      expect(isValidUUID('')).toBe(false);
    });
  });

  describe('isValidAmount', () => {
    test('should return true for integer amounts', () => {
      expect(isValidAmount(100)).toBe(true);
      expect(isValidAmount(-50)).toBe(true);
      expect(isValidAmount(0)).toBe(true);
    });

    test('should return false for non-integer amounts', () => {
      expect(isValidAmount(100.5)).toBe(false);
      expect(isValidAmount('100')).toBe(false);
      expect(isValidAmount(null)).toBe(false);
      expect(isValidAmount(undefined)).toBe(false);
    });
  });

  describe('validateTransactionForm', () => {
    test('should return valid for correct inputs', () => {
      const result = validateTransactionForm('550e8400-e29b-41d4-a716-446655440000', 100);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should return errors for missing account_id', () => {
      const result = validateTransactionForm('', 100);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Account ID is required');
    });

    test('should return errors for invalid UUID', () => {
      const result = validateTransactionForm('invalid-uuid', 100);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Account ID must be a valid UUID');
    });

    test('should return errors for missing amount', () => {
      const result = validateTransactionForm('550e8400-e29b-41d4-a716-446655440000', '');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Amount is required');
    });

    test('should return errors for non-integer amount', () => {
      const result = validateTransactionForm('550e8400-e29b-41d4-a716-446655440000', '100.5');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Amount must be an integer');
    });

    test('should return multiple errors', () => {
      const result = validateTransactionForm('', '');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Account ID is required');
      expect(result.errors).toContain('Amount is required');
    });
  });
});