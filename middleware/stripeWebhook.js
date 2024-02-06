const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { updateUserSubscription, updatePaymentStatus } = require('../controller/paymentController');

exports.stripeListenWebhook = (req, res) => {
    let data
    let eventType
    const webhookSecret = 'whsec_AeqnnLKiS8h2BfCikqxfcplSBqjP2Gwl'

    if (webhookSecret) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event
        let signature = req.headers['stripe-signature']

        console.log(req.headers)

        try {
            event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret)
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`)
            return res.sendStatus(400)
        }
        // Extract the object from the event.
        data = event.data
        eventType = event.type
    } else {
        // Webhook signing is recommended, but if the secret is not configured in `config.js`,
        // retrieve the event data directly from the request body.
        data = req.body.data
        eventType = req.body.type
    }

    // Handle the event
    switch (eventType) {
        case 'checkout.session.completed':
            const session = data.object
            console.log(session)
            // Then define and call a function to handle the event checkout.session.completed
            break
        default:
            console.log(`Unhandled event type ${eventType}`)
    }

    switch (eventType.type) {
        case 'customer.subscription.created':
          console.log('Subscription created:', eventType);
    
          const subscriptionId = eventType.data.object.id;
    
           updateUserSubscription(subscriptionId);
    
          break;
    
        case 'checkout.session.completed':
          console.log('Checkout session completed:', eventType);
    
          const sessionId = eventType.data.object.id;
    
           updatePaymentStatus(sessionId, 'success');
    
          break;
    
        case 'invoice.payment_succeeded':
          console.log('Invoice payment succeeded:', eventType);
    
          const invoiceId = eventType.data.object.id;
    
           updatePaymentStatus(invoiceId, 'success');
    
          break;
    
        case 'invoice.payment_failed':
          console.log('Invoice payment failed:', eventType);
    
          const failedInvoiceId = eventType.data.object.id;
           updatePaymentStatus(failedInvoiceId, 'failed');
    
          break;
    
    
        default:
          console.log('Unhandled event type:', eventType);
      }

    res.json({ received: true })
}