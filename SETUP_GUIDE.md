# WhatsApp Notification Setup Guide

This guide will help you set up WhatsApp notifications for your Meat-Ghar website.

## Quick Start (5 Minutes)

### Step 1: Create Twilio Account

1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free trial account
3. Verify your email and phone number

### Step 2: Get Your Twilio Credentials

1. Log in to [Twilio Console](https://console.twilio.com/)
2. On the dashboard, you'll see:
   - **Account SID** (starts with "AC...")
   - **Auth Token** (click to reveal)
3. Copy both values - you'll need them shortly

### Step 3: Set Up WhatsApp Sandbox

1. In Twilio Console, go to: **Messaging** → **Try it out** → **Send a WhatsApp message**
2. You'll see a WhatsApp Sandbox number (usually `+1 415 523 8886`)
3. You'll also see a code like: `join <random-words>`
4. On your phone:
   - Save the Twilio number in your contacts
   - Send the join code via WhatsApp (e.g., "join happy-dog")
   - You'll receive a confirmation message
5. Repeat this step for your partner's phone too

### Step 4: Configure Your Application

1. In your project folder, copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` file in a text editor and fill in:

   ```env
   # From Twilio Console Dashboard
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   
   # Twilio sandbox number (from step 3)
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   
   # Your phone number (must join sandbox first!)
   ADMIN_PHONE_NUMBER=whatsapp:+92XXXXXXXXXX
   
   # Partner's phone number (must join sandbox first!)
   PARTNER_PHONE_NUMBER=whatsapp:+92XXXXXXXXXX
   
   PORT=3000
   ```

3. **Important:** Replace the phone numbers with actual numbers in international format:
   - Start with `whatsapp:+`
   - Include country code (e.g., 92 for Pakistan, 1 for US)
   - No spaces or dashes
   - Example: `whatsapp:+92XXXXXXXXXX`

### Step 5: Install and Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. You should see:
   ```
   🚀 Server running on port 3000
   📱 WhatsApp notification service ENABLED
   ```

### Step 6: Test It!

1. Open your browser and go to: `http://localhost:3000/index.html`
2. Browse products and add items to your cart
3. Go to checkout and place a test order
4. Check your WhatsApp - both admin and partner should receive the order details!

## Troubleshooting

### Problem: "WhatsApp notification service DISABLED"

**Solution:** Check your `.env` file:
- Make sure all Twilio credentials are filled in
- No extra spaces or quotes around values
- File must be named exactly `.env` (not `.env.txt`)

### Problem: "Not receiving WhatsApp messages"

**Solutions:**
1. **Did you join the sandbox?**
   - Both admin and partner phones must send the join code first
   - Check WhatsApp for the confirmation message

2. **Phone number format:**
   - Must start with `whatsapp:+`
   - Must include country code
   - No spaces, dashes, or parentheses
   - Correct: `whatsapp:+92XXXXXXXXXX`
   - Wrong: `whatsapp:0300-1234567` or `+92 300 123 4567`

3. **Check the server console:**
   - Look for error messages
   - They will tell you exactly what's wrong

### Problem: "Error: The 'To' number is not a valid WhatsApp number"

**Solution:**
- Make sure the phone number joined the Twilio sandbox
- Send the join code from that phone to the Twilio number
- Wait for confirmation before testing again

### Problem: "Server won't start"

**Solutions:**
1. Check if port 3000 is already in use:
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. Install Node.js if not installed:
   - Download from [nodejs.org](https://nodejs.org/)
   - Version 14 or higher required

## Moving to Production

The free Twilio account works for testing, but has limitations:
- Can only send messages to verified/sandbox-joined numbers
- Limited message quota

For production:

1. **Upgrade Twilio Account**
   - Add payment method to Twilio
   - Costs: ~$0.005 per WhatsApp message

2. **Get WhatsApp Business Approval**
   - Apply through Twilio Console
   - Usually takes 1-3 business days
   - You'll get your own WhatsApp Business number

3. **Update Configuration**
   - Replace sandbox number with your approved number in `.env`
   - Remove sandbox limitations

4. **Deploy to Production**
   - Host your server (Heroku, DigitalOcean, AWS, etc.)
   - Update the API URL in `checkout.js`
   - Change from `http://localhost:3000` to your production URL

## Support

If you run into issues:

1. Check the server console for error messages
2. Test the health endpoint: `http://localhost:3000/api/health`
3. Verify all credentials in `.env` file
4. Make sure both phones joined the Twilio sandbox

## Cost Estimate

Twilio WhatsApp Pricing (as of 2024):
- **Business-initiated messages:** ~$0.0042 per message
- **Free trial:** $15 credit (enough for ~3,500 messages)

With 2 recipients per order (admin + partner):
- 100 orders = 200 messages = ~$0.84
- 1,000 orders = 2,000 messages = ~$8.40

Very affordable for most businesses!
