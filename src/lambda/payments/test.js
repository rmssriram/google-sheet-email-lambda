// testLocal.js
const { handler } = require('./paymentService');

async function testPaymentLambda() {
  const testCases = [
    {
      // Valid payment details
      amount: 5000,
      currency: 'usd',
      payment_method: 'pm_card_visa', // Visa test card provided by Stripe
    },
    {
      // Insufficient funds test
      amount: 5000,
      currency: 'usd',
      payment_method: 'pm_card_chargeCustomerFail', // Test card for insufficient funds
    },
    {
      // Invalid card details
      amount: 5000,
      currency: 'usd',
      payment_method: 'pm_card_invalid', // Invalid card test
    },
    {
      // Authentication required (3D Secure)
      amount: 5000,
      currency: 'usd',
      payment_method: 'pm_card_authenticationRequired', // Card requiring 3D Secure
    },
  ];

  for (const testCase of testCases) {
    const event = {
      body: JSON.stringify(testCase),
    };

    const response = await handler(event);
    console.log(`Test Case: ${JSON.stringify(testCase)}`);
    console.log('Lambda Response:', JSON.parse(response.body));
    console.log('\n');
  }
}

testPaymentLambda();
