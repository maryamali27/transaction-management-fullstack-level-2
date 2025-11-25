module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/utils/storage.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Global in-memory storage module
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
class InMemoryStorage {
    constructor(){
        if (!/*TURBOPACK member replacement*/ __turbopack_context__.g.transactions) {
            /*TURBOPACK member replacement*/ __turbopack_context__.g.transactions = [];
        }
        if (!/*TURBOPACK member replacement*/ __turbopack_context__.g.accounts) {
            /*TURBOPACK member replacement*/ __turbopack_context__.g.accounts = new Set();
        }
        this.transactions = /*TURBOPACK member replacement*/ __turbopack_context__.g.transactions;
        this.accounts = /*TURBOPACK member replacement*/ __turbopack_context__.g.accounts;
    }
    // Get all transactions (newest first)
    getAllTransactions() {
        return [
            ...this.transactions
        ].reverse();
    }
    // Get transaction by ID
    getTransactionById(transaction_id) {
        return this.transactions.find((t)=>t.transaction_id === transaction_id);
    }
    // Get account balance
    getAccountBalance(account_id) {
        return this.transactions.filter((t)=>t.account_id === account_id).reduce((sum, t)=>sum + t.amount, 0);
    }
    // Get account by ID (check if exists)
    getAccountById(account_id) {
        const hasTransactions = this.transactions.some((t)=>t.account_id === account_id);
        return hasTransactions ? {
            account_id
        } : null;
    }
    // Create transaction
    createTransaction(account_id, amount) {
        // Generate transaction ID
        const transaction_id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8;
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
const __TURBOPACK__default__export__ = new InMemoryStorage();
}),
"[project]/utils/validation.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// UUID validation utility
__turbopack_context__.s([
    "isValidAmount",
    ()=>isValidAmount,
    "isValidUUID",
    ()=>isValidUUID,
    "validateTransactionForm",
    ()=>validateTransactionForm
]);
const isValidUUID = (uuid)=>{
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};
const isValidAmount = (amount)=>{
    return typeof amount === 'number' && Number.isInteger(amount);
};
const validateTransactionForm = (account_id, amount)=>{
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
}),
"[project]/pages/api/transactions/[transaction_id].js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$storage$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/storage.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$validation$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/validation.js [api] (ecmascript)");
;
;
function handler(req, res) {
    const { transaction_id } = req.query;
    if (req.method !== 'GET') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }
    if (!transaction_id || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$validation$2e$js__$5b$api$5d$__$28$ecmascript$29$__["isValidUUID"])(transaction_id)) {
        return res.status(400).json({
            error: 'Invalid transaction_id format'
        });
    }
    const transaction = __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$storage$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"].getTransactionById(transaction_id);
    if (!transaction) {
        return res.status(404).json({
            error: 'Transaction not found'
        });
    }
    res.status(200).json(transaction);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__667d305d._.js.map