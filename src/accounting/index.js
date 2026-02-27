const readline = require('readline');

// ============================================================================
// Data Storage Module (equivalent to data.cob)
// ============================================================================
class AccountData {
    constructor() {
        this.storageBalance = 1000.00;
    }

    read() {
        return this.storageBalance;
    }

    write(balance) {
        this.storageBalance = balance;
    }
}

// ============================================================================
// Operations Module (equivalent to operations.cob)
// ============================================================================
class Operations {
    constructor(dataProgram) {
        this.dataProgram = dataProgram;
    }

    total() {
        const balance = this.dataProgram.read();
        console.log(`Current balance: ${balance.toFixed(2)}`);
    }

    credit(amount) {
        const currentBalance = this.dataProgram.read();
        const newBalance = currentBalance + amount;
        this.dataProgram.write(newBalance);
        console.log(`Amount credited. New balance: ${newBalance.toFixed(2)}`);
    }

    debit(amount) {
        const currentBalance = this.dataProgram.read();
        if (currentBalance >= amount) {
            const newBalance = currentBalance - amount;
            this.dataProgram.write(newBalance);
            console.log(`Amount debited. New balance: ${newBalance.toFixed(2)}`);
        } else {
            console.log('Insufficient funds for this debit.');
        }
    }
}

// ============================================================================
// Main Program (equivalent to main.cob)
// ============================================================================
class AccountManagementSystem {
    constructor() {
        this.dataProgram = new AccountData();
        this.operations = new Operations(this.dataProgram);
        this.continueFlag = true;

        // Set up readline interface
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    displayMenu() {
        console.log('--------------------------------');
        console.log('Account Management System');
        console.log('1. View Balance');
        console.log('2. Credit Account');
        console.log('3. Debit Account');
        console.log('4. Exit');
        console.log('--------------------------------');
    }

    promptChoice() {
        return new Promise((resolve) => {
            this.rl.question('Enter your choice (1-4): ', (choice) => {
                resolve(parseInt(choice, 10));
            });
        });
    }

    promptAmount() {
        return new Promise((resolve) => {
            this.rl.question('Enter amount: ', (amount) => {
                resolve(parseFloat(amount));
            });
        });
    }

    async handleChoice(choice) {
        switch (choice) {
            case 1:
                this.operations.total();
                break;
            case 2:
                const creditAmount = await this.promptAmount();
                if (!isNaN(creditAmount) && creditAmount > 0) {
                    this.operations.credit(creditAmount);
                } else {
                    console.log('Invalid amount entered.');
                }
                break;
            case 3:
                const debitAmount = await this.promptAmount();
                if (!isNaN(debitAmount) && debitAmount > 0) {
                    this.operations.debit(debitAmount);
                } else {
                    console.log('Invalid amount entered.');
                }
                break;
            case 4:
                this.continueFlag = false;
                break;
            default:
                console.log('Invalid choice, please select 1-4.');
        }
    }

    async run() {
        console.log('');
        console.log('Welcome to the Account Management System');
        console.log('');

        while (this.continueFlag) {
            this.displayMenu();
            const choice = await this.promptChoice();
            await this.handleChoice(choice);
            console.log('');
        }

        console.log('Exiting the program. Goodbye!');
        this.rl.close();
    }
}

// ============================================================================
// Exports for Testing
// ============================================================================
module.exports = {
    AccountData,
    Operations,
    AccountManagementSystem
};

// ============================================================================
// Application Entry Point
// ============================================================================
// Only run if this is the main module (not imported for testing)
if (require.main === module) {
    const app = new AccountManagementSystem();
    app.run().catch((err) => {
        console.error('Error:', err);
        process.exit(1);
    });
}
