# Meat-Ghar

E-commerce website for meat products with WhatsApp order notification feature.

## Features

- Browse and order meat products (Chicken, Mutton, Beef, Frozen items)
- Shopping cart functionality
- Order tracking
- Admin panel for order management
- **WhatsApp notifications** - Automatic WhatsApp messages to admin and partner when orders are placed

## WhatsApp Notification Setup

This feature sends WhatsApp messages to the admin and partner whenever a new order is placed, including complete order details.

### Prerequisites

1. **Twilio Account**: Sign up for a free Twilio account at [https://www.twilio.com/](https://www.twilio.com/)
2. **Twilio WhatsApp Sandbox**: Enable WhatsApp in your Twilio account
   - Go to Twilio Console → Messaging → Try it out → Send a WhatsApp message
   - Follow the instructions to join the sandbox by sending a code to the Twilio WhatsApp number

### Configuration Steps

1. **Copy the environment template file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the `.env` file with your credentials:**
   
   ```env
   # Get these from Twilio Console (https://console.twilio.com/)
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   
   # Twilio WhatsApp number (from sandbox or your approved number)
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   
   # Admin phone number (with country code)
   ADMIN_PHONE_NUMBER=whatsapp:+923001234567
   
   # Partner phone number (with country code)
   PARTNER_PHONE_NUMBER=whatsapp:+923009876543
   ```

3. **Finding Your Twilio Credentials:**
   - Go to [Twilio Console](https://console.twilio.com/)
   - Your **Account SID** and **Auth Token** are on the dashboard
   - For the **WhatsApp Number**: 
     - Sandbox: `whatsapp:+14155238886` (default sandbox number)
     - Production: Use your approved WhatsApp Business number

4. **Phone Number Format:**
   - Always use international format: `whatsapp:+[country_code][number]`
   - Example for Pakistan: `whatsapp:+923001234567`
   - Example for US: `whatsapp:+11234567890`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```
   
   The server will run on `http://localhost:3000`

3. **Open the website:**
   - Navigate to `http://localhost:3000/index.html` in your browser

### Testing WhatsApp Notifications

1. **Join Twilio Sandbox** (if using sandbox):
   - Send the code shown in Twilio Console to `+1 415 523 8886` on WhatsApp
   - You should receive a confirmation message

2. **Place a test order:**
   - Browse products and add items to cart
   - Go to checkout and fill in the order details
   - Complete the order
   - Both admin and partner should receive WhatsApp messages with order details

### WhatsApp Message Format

When an order is placed, the following information is sent via WhatsApp:

```
🥩 NEW ORDER RECEIVED 🥩

📝 Order ID: MG1234567890
📅 Date: [timestamp]

👤 Customer Details:
Name: John Doe
Phone: +923001234567
Email: john@example.com
Address: 123 Main St, Karachi
Notes: Please deliver before 6 PM

🛒 Order Items:
1. Whole Chicken x 2 - Rs. 1440
2. Mutton Chops x 1 - Rs. 1200

💰 Payment Summary:
Subtotal: Rs. 2640
Delivery Fee: Rs. 100
Total: Rs. 2740

Please prepare and dispatch this order. 🚀
```

### Troubleshooting

**Notifications not received:**
- Verify Twilio credentials in `.env` file
- Ensure phone numbers are in correct format with `whatsapp:` prefix
- Check if you've joined the Twilio sandbox (for sandbox numbers)
- Check server console for error messages
- Verify the server is running (`npm start`)

**CORS errors:**
- Make sure the server is running on `localhost:3000`
- Check browser console for specific error messages

**Server not starting:**
- Ensure Node.js is installed: `node --version`
- Check if port 3000 is available
- Review `.env` file for syntax errors

### Production Deployment

For production use:

1. **Apply for WhatsApp Business API** through Twilio
2. Get your own approved WhatsApp Business number
3. Update environment variables with production credentials
4. Deploy the server to a hosting platform (Heroku, AWS, DigitalOcean, etc.)
5. Update the API endpoint in `checkout.js` from `localhost:3000` to your production URL

### API Endpoints

- `POST /api/send-order-notification` - Send WhatsApp notification for an order
- `GET /api/health` - Check server and configuration status

## Admin Login

- Username: `adminmeat`
- Password: `meat101`

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- WhatsApp Integration: Twilio API
- Data Storage: LocalStorage (Frontend)

## File Structure

```
├── server.js              # Backend server with WhatsApp integration
├── checkout.js            # Order placement with WhatsApp notification
├── admin.js               # Admin panel logic
├── script.js              # Main frontend logic
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
└── package.json          # Node.js dependencies
```

## License

ISC