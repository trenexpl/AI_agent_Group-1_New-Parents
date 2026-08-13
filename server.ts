import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import Stripe from 'stripe';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy Stripe Initialization
  let stripeClient: Stripe | null = null;
  function getStripe(): Stripe | null {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return null;
    if (!stripeClient) {
      stripeClient = new Stripe(key);
    }
    return stripeClient;
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', stripeConfigured: !!process.env.STRIPE_SECRET_KEY });
  });

  // Stripe Checkout Session API Endpoint
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { packageName, credits, priceSGD, successUrl, cancelUrl } = req.body;

      if (!packageName || !credits || !priceSGD) {
        return res.status(400).json({ error: 'Missing required package details' });
      }

      const stripe = getStripe();

      if (!stripe) {
        // Return clear response if Stripe API key is not yet set in environment
        return res.json({
          url: null,
          isSimulation: true,
          message: 'STRIPE_SECRET_KEY not set in environment. Falling back to Stripe Checkout Simulator.',
          packageInfo: { packageName, credits, priceSGD },
        });
      }

      const origin = req.headers.origin || `http://localhost:${PORT}`;

      // Create standard Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'sgd',
              product_data: {
                name: `${packageName} (${credits} Credits)`,
                description: `Happy Parents Class Credits Top-Up`,
                images: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'],
              },
              unit_amount: Math.round(Number(priceSGD) * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl || `${origin}/?stripe_success=true&credits=${credits}&package=${encodeURIComponent(packageName)}`,
        cancel_url: cancelUrl || `${origin}/?stripe_cancel=true`,
      });

      return res.json({ url: session.url, isSimulation: false });
    } catch (err: any) {
      console.error('Error creating Stripe checkout session:', err);
      return res.status(500).json({
        error: err.message || 'Failed to create Stripe checkout session',
        isSimulation: true,
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
