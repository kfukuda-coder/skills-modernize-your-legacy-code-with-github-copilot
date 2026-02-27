const { AccountData, Operations } = require('./index');

console.log('=== Node.js Account Management System - Interactive Demo ===\n');

const accountData = new AccountData();
const operations = new Operations(accountData);

console.log('1. Initial Balance Check:');
console.log('   Expected: 1000.00');
operations.total();

console.log('\n2. Credit Account by $150.00:');
console.log('   Expected: New balance 1150.00');
operations.credit(150.00);

console.log('\n3. Credit Account by $50.25:');
console.log('   Expected: New balance 1200.25');
operations.credit(50.25);

console.log('\n4. Current Balance Check:');
console.log('   Expected: 1200.25');
operations.total();

console.log('\n5. Debit Account by $300.00:');
console.log('   Expected: New balance 900.25');
operations.debit(300.00);

console.log('\n6. Attempt Debit of $1000.00 (Insufficient Funds):');
console.log('   Expected: Insufficient funds message');
operations.debit(1000.00);

console.log('\n7. Final Balance Check:');
console.log('   Expected: 900.25');
operations.total();

console.log('\n=== All operations completed successfully! ===');
