const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

exports.handler = async (event) => {
  const { amount, currency, payment_method } = JSON.parse(event.body);

  if (!amount || !currency || !payment_method) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Amount, currency, and payment method are required' }),
    };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
    });

    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method,
    });

    if (confirmedPaymentIntent.status === 'succeeded') {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Payment succeeded',
          paymentDetails: {
            id: confirmedPaymentIntent.id,
            amount: confirmedPaymentIntent.amount,
            currency: confirmedPaymentIntent.currency,
            status: confirmedPaymentIntent.status,
            created: confirmedPaymentIntent.created,
          },
        }),
      };
    } else if (confirmedPaymentIntent.status === 'requires_action') {
      return {
        statusCode: 402,
        body: JSON.stringify({
          message: 'Additional authentication required',
          paymentDetails: {
            id: confirmedPaymentIntent.id,
            status: confirmedPaymentIntent.status,
            clientSecret: confirmedPaymentIntent.client_secret,
          },
        }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Payment failed, check payment method or details',
          paymentDetails: confirmedPaymentIntent,
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
