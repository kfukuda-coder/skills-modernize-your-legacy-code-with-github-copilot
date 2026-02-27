const { AccountData, Operations } = require('../index');

describe('COBOL Account Management System - Unit Tests', () => {
    
    // ========================================================================
    // Test Suite 1: AccountData (Data Storage Module) - Equivalent to data.cob
    // ========================================================================
    describe('AccountData - Data Storage Module', () => {
        let accountData;

        beforeEach(() => {
            // Reset for each test
            accountData = new AccountData();
        });

        test('TC-01.1: Initial balance should be 1000.00', () => {
            expect(accountData.read()).toBe(1000.00);
        });

        test('TC-01.2: Read operation returns current balance', () => {
            const balance = accountData.read();
            expect(balance).toBe(1000.00);
            expect(typeof balance).toBe('number');
        });

        test('Write operation updates balance correctly', () => {
            accountData.write(1500.00);
            expect(accountData.read()).toBe(1500.00);
        });

        test('Write operation with decimal values', () => {
            accountData.write(1234.56);
            expect(accountData.read()).toBe(1234.56);
        });

        test('Multiple read operations return same value', () => {
            const balance1 = accountData.read();
            const balance2 = accountData.read();
            expect(balance1).toBe(balance2);
        });
    });

    // ========================================================================
    // Test Suite 2: Operations Module - Equivalent to operations.cob
    // ========================================================================
    describe('Operations - Business Logic Module', () => {
        let accountData;
        let operations;
        let consoleLogSpy;

        beforeEach(() => {
            accountData = new AccountData();
            operations = new Operations(accountData);
            // Spy on console.log to verify output
            consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        });

        afterEach(() => {
            consoleLogSpy.mockRestore();
        });

        // TC-01: View Balance
        describe('TC-01: View current balance', () => {
            test('Should display current balance of 1000.00', () => {
                operations.total();
                expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1000.00');
            });

            test('Should display updated balance after changes', () => {
                accountData.write(1500.00);
                operations.total();
                expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1500.00');
            });
        });

        // TC-02: Credit Account
        describe('TC-02: Credit account with valid amount', () => {
            test('Should increase balance by credit amount', () => {
                operations.credit(50.00);
                expect(accountData.read()).toBe(1050.00);
            });

            test('Should display new balance after credit', () => {
                operations.credit(50.00);
                expect(consoleLogSpy).toHaveBeenCalledWith('Amount credited. New balance: 1050.00');
            });

            test('Should handle multiple credits correctly', () => {
                operations.credit(100.00);
                operations.credit(50.00);
                expect(accountData.read()).toBe(1150.00);
            });

            test('Should handle decimal credit amounts', () => {
                operations.credit(25.75);
                expect(accountData.read()).toBe(1025.75);
            });

            test('Should handle large credit amounts', () => {
                operations.credit(5000.00);
                expect(accountData.read()).toBe(6000.00);
            });
        });

        // TC-03: Debit Account with Sufficient Funds
        describe('TC-03: Debit account with sufficient funds', () => {
            test('Should decrease balance by debit amount', () => {
                operations.debit(100.00);
                expect(accountData.read()).toBe(900.00);
            });

            test('Should display new balance after successful debit', () => {
                operations.debit(100.00);
                expect(consoleLogSpy).toHaveBeenCalledWith('Amount debited. New balance: 900.00');
            });

            test('Should allow debit equal to current balance', () => {
                operations.debit(1000.00);
                expect(accountData.read()).toBe(0.00);
            });

            test('Should handle multiple debits with sufficient funds', () => {
                operations.debit(200.00);
                operations.debit(300.00);
                expect(accountData.read()).toBe(500.00);
            });

            test('Should handle decimal debit amounts', () => {
                operations.debit(100.50);
                expect(accountData.read()).toBe(899.50);
            });
        });

        // TC-04: Debit Account with Insufficient Funds
        describe('TC-04: Debit account with insufficient funds', () => {
            test('Should reject debit when balance is insufficient', () => {
                operations.debit(2000.00);
                expect(accountData.read()).toBe(1000.00); // Balance unchanged
            });

            test('Should display insufficient funds message', () => {
                operations.debit(2000.00);
                expect(consoleLogSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            });

            test('Should protect against negative balances', () => {
                operations.debit(1500.00);
                expect(accountData.read()).toBe(1000.00);
                expect(accountData.read()).not.toBeLessThan(0);
            });

            test('Should not allow overdraft after successful debits', () => {
                operations.debit(500.00);
                operations.debit(600.00); // Would result in -100
                expect(accountData.read()).toBe(500.00); // Second debit rejected
            });
        });

        // TC-07: Sequence of Operations
        describe('TC-07: Sequence of operations', () => {
            test('Should correctly process view -> credit -> view sequence', () => {
                operations.total();
                expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1000.00');

                consoleLogSpy.mockClear();
                operations.credit(100.00);
                expect(consoleLogSpy).toHaveBeenCalledWith('Amount credited. New balance: 1100.00');

                consoleLogSpy.mockClear();
                operations.total();
                expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1100.00');
            });

            test('Should correctly process credit -> debit -> view sequence', () => {
                operations.credit(500.00);
                expect(accountData.read()).toBe(1500.00);

                operations.debit(200.00);
                expect(accountData.read()).toBe(1300.00);

                consoleLogSpy.mockClear();
                operations.total();
                expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1300.00');
            });

            test('Should handle mixed operations with data integrity', () => {
                operations.credit(1000.00);
                expect(accountData.read()).toBe(2000.00);

                operations.debit(500.00);
                expect(accountData.read()).toBe(1500.00);

                operations.credit(250.00);
                expect(accountData.read()).toBe(1750.00);

                operations.debit(250.00);
                expect(accountData.read()).toBe(1500.00);
            });

            test('Should maintain data consistency across multiple operations', () => {
                const operations1 = new Operations(accountData);
                const operations2 = new Operations(accountData);

                operations1.credit(100.00);
                expect(operations2.read ? false : accountData.read()).toBe(1100.00);

                operations2.debit(50.00);
                expect(accountData.read()).toBe(1050.00);
            });
        });

        // TC-06: Invalid Operations (edge cases)
        describe('TC-06: Handle edge cases and bounds', () => {
            test('Should handle very small credit amounts', () => {
                operations.credit(0.01);
                expect(accountData.read()).toBe(1000.01);
            });

            test('Should handle zero debit (should still work, edge case)', () => {
                const initialBalance = accountData.read();
                operations.debit(0);
                expect(accountData.read()).toBe(initialBalance);
            });

            test('Should prevent negative debit with amount greater than balance', () => {
                operations.debit(1001.00);
                expect(accountData.read()).toBe(1000.00);
                expect(consoleLogSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            });
        });
    });

    // ========================================================================
    // Integration Tests
    // ========================================================================
    describe('Integration Tests - Full Business Logic', () => {
        let accountData;
        let operations;

        beforeEach(() => {
            accountData = new AccountData();
            operations = new Operations(accountData);
            jest.spyOn(console, 'log').mockImplementation();
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('Real-world scenario: Multiple transactions over time', () => {
            // Day 1: Check balance
            expect(accountData.read()).toBe(1000.00);

            // Day 2: Deposit (Credit) 500
            operations.credit(500.00);
            expect(accountData.read()).toBe(1500.00);

            // Day 3: Withdraw (Debit) 300
            operations.debit(300.00);
            expect(accountData.read()).toBe(1200.00);

            // Day 4: Try to withdraw more than available
            operations.debit(1500.00);
            expect(accountData.read()).toBe(1200.00); // Should be unchanged

            // Day 5: Deposit 100
            operations.credit(100.00);
            expect(accountData.read()).toBe(1300.00);
        });

        test('Boundary test: Debit exact balance amount', () => {
            operations.credit(5000.00);
            expect(accountData.read()).toBe(6000.00);

            operations.debit(6000.00);
            expect(accountData.read()).toBe(0.00);
        });

        test('Business rule: No negative balances allowed', () => {
            for (let i = 0; i < 10; i++) {
                operations.debit(500.00);
            }
            // After 2 successful debits, balance should be 0, remaining debits should fail
            expect(accountData.read()).toBe(0.00);
            expect(accountData.read()).not.toBeLessThan(0);
        });
    });
});
