# COBOL App Test Plan

This test plan covers all business logic paths in the current COBOL account management system. It is intended for stakeholder validation and will later serve as the basis for automated tests in a Node.js implementation.

| Test Case ID | Test Case Description                            | Pre-conditions               | Test Steps                                                                 | Expected Result                                              | Actual Result | Status | Comments                                |
|--------------|--------------------------------------------------|------------------------------|---------------------------------------------------------------------------|--------------------------------------------------------------|---------------|--------|-----------------------------------------|
| TC-01        | View current balance                             | Application running; default balance (1000.00) | 1. Start app
2. Enter choice `1`                                                          | Balance of `1000.00` displayed                                 |               |        |                                         |
| TC-02        | Credit account with valid amount                 | App running; balance known   | 1. Start app
2. Enter choice `2`
3. Enter credit amount (e.g., 50)                                     | Balance increases by amount; new balance shown (1050.00)               |               |        |                                         |
| TC-03        | Debit account with sufficient funds              | App running; balance sufficient (>= amount) | 1. Start app
2. Enter choice `3`
3. Enter debit amount (e.g., 100)                                      | Balance decreases by amount; new balance shown (900.00)                |               |        |                                         |
| TC-04        | Debit account with insufficient funds            | App running; balance less than debit amount | 1. Start app
2. Enter choice `3`
3. Enter debit amount greater than balance                                 | Display "Insufficient funds" message; balance unchanged               |               |        |                                         |
| TC-05        | Exit application                                 | App running                  | 1. Start app
2. Enter choice `4`                                                          | Program displays exit message and terminates                         |               |        |                                         |
| TC-06        | Invalid menu choice                              | App running                  | 1. Start app
2. Enter choice outside 1–4 (e.g., 5 or 'a')                       | Display error "Invalid choice, please select 1-4."                   |               |        |                                         |
| TC-07        | Sequence of operations leading back to menu       | App running                  | 1. Perform any supported operation (view/credit/debit)
2. Observe return to menu                                               | After operation result, menu re-displayed until exit               |               |        | Loop behaviour verified                 |


Each row represents a business rule or flow. Actual result and status columns will be filled during stakeholder validation or automated testing.