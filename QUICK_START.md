# Quick Reference - WhatsApp Notifications

## What This Feature Does

When a customer places an order on your Meat-Ghar website, you and your partner will automatically receive a WhatsApp message with:
- Customer details (name, phone, email, address)
- Complete order items and quantities
- Total amount
- Order ID for tracking

## How to Get It Working (Simple Steps)

### 1. Sign Up for Twilio (Free Trial)
- Go to: https://www.twilio.com/try-twilio
- Create a free account (no credit card needed for trial)
- You'll get $15 free credit (~3,500 messages)

### 2. Get Your Credentials
In the Twilio dashboard, copy these two values:
- **Account SID** (starts with "AC...")
- **Auth Token** (click "show" to reveal it)

### 3. Set Up WhatsApp Sandbox
- In Twilio Console, go to: Messaging → Try it out → WhatsApp
- You'll see a phone number like: `+1 415 523 8886`
- You'll see a code like: `join happy-dog`
- From your WhatsApp: Send that code to that number
- You'll get: "You are all set! ✅"
- Your partner should do the same from their phone

### 4. Configure Your Server
Create a file named `.env` (copy from `.env.example`) and fill in:

```
TWILIO_ACCOUNT_SID=AC... (from step 2)
TWILIO_AUTH_TOKEN=your_token (from step 2)
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
ADMIN_PHONE_NUMBER=whatsapp:+92300XXXXXXX (your number)
PARTNER_PHONE_NUMBER=whatsapp:+92300XXXXXXX (partner's number)
```

**Important:** Phone numbers must:
- Start with `whatsapp:+`
- Include country code (92 for Pakistan)
- Have NO spaces or dashes

### 5. Start the Server
```bash
npm install
npm start
```

You should see: ✅ WhatsApp notification service ENABLED

### 6. Test It!
- Go to: http://localhost:3000/index.html
- Add products to cart
- Complete checkout
- Check WhatsApp! 📱

## Example WhatsApp Message You'll Receive

```
🥩 NEW ORDER RECEIVED 🥩

📝 Order ID: MG1706582400000
📅 Date: Jan 29, 2024, 10:00 PM

👤 Customer Details:
Name: Ahmed Khan
Phone: +92300XXXXXXX
Email: ahmed@email.com
Address: House #123, Street 5, Karachi
Notes: Please deliver before 8 PM

🛒 Order Items:
1. Whole Chicken x 2 - Rs. 1440
2. Mutton Chops x 1 - Rs. 1200

💰 Payment Summary:
Subtotal: Rs. 2640
Delivery Fee: Rs. 100
Total: Rs. 2740

Please prepare and dispatch this order. 🚀
```

## Costs

- **Free Trial:** $15 credit (3,500+ messages)
- **After Trial:** ~$0.004 per message
- **Per Order:** 2 messages (admin + partner) = less than 1 cent
- **100 Orders:** ~$0.84
- **1000 Orders:** ~$8.40

Very affordable! 💰

## Troubleshooting

### Not Getting Messages?
1. ✅ Did you join the Twilio sandbox? (Both admin and partner)
2. ✅ Are phone numbers in correct format? (`whatsapp:+92...`)
3. ✅ Is the server running? (Look for "ENABLED" message)
4. ✅ Check server console for errors

### Can't Access Website?
- Make sure server is running: `npm start`
- Go to: `http://localhost:3000/index.html` (not just `localhost:3000`)

### Need Help?
- Full setup guide: See `SETUP_GUIDE.md`
- Technical details: See `README.md`

## Going Live (Production)

For real business use:

1. **Upgrade Twilio Account** (add payment method)
2. **Apply for WhatsApp Business** (through Twilio)
3. **Deploy Server** (Heroku, DigitalOcean, AWS, etc.)
4. **Update URL** in `checkout.js` (change localhost to your server URL)

That's it! Your customers order → You get WhatsApp! 🎉
