// WhatsApp Order Notification Server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (only allow specific file types for security)
// This middleware filters requests to prevent access to sensitive files
// like .env, package.json, and server.js while allowing HTML, CSS, JS, and images
const serveStaticWithFilter = (req, res, next) => {
    const allowedExtensions = ['.html', '.css', '.js', '.jpg', '.png', '.jpeg', '.gif', '.svg', '.ico'];
    const path = require('path');
    const ext = path.extname(req.path).toLowerCase();
    
    // Block access to sensitive files
    const blockedFiles = ['.env', '.env.example', 'package.json', 'package-lock.json', 'server.js', 'node_modules'];
    const fileName = path.basename(req.path);
    
    // If it's a blocked file or doesn't have an allowed extension, skip
    if (blockedFiles.some(blocked => fileName.includes(blocked)) || 
        (ext && !allowedExtensions.includes(ext))) {
        return res.status(404).send('Not Found');
    }
    
    next();
};

app.use(serveStaticWithFilter);
// NOTE: express.static serves from __dirname but is protected by the filter above
// For production, consider moving static files to a dedicated 'public' directory
app.use(express.static(__dirname));

// Twilio Configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Format: whatsapp:+14155238886
const adminPhone = process.env.ADMIN_PHONE_NUMBER; // Format: whatsapp:+92XXXXXXXXXX
const partnerPhone = process.env.PARTNER_PHONE_NUMBER; // Format: whatsapp:+92XXXXXXXXXX

// Initialize Twilio client
let twilioClient;
if (accountSid && authToken) {
    twilioClient = twilio(accountSid, authToken);
}

// Format order message for WhatsApp
function formatOrderMessage(order) {
    let message = `🥩 *NEW ORDER RECEIVED* 🥩\n\n`;
    message += `📝 *Order ID:* ${order.id}\n`;
    message += `📅 *Date:* ${new Date(order.date).toLocaleString()}\n\n`;
    
    message += `👤 *Customer Details:*\n`;
    message += `Name: ${order.customer.name}\n`;
    message += `Phone: ${order.customer.phone}\n`;
    message += `Email: ${order.customer.email}\n`;
    message += `Address: ${order.customer.address}, ${order.customer.city}\n`;
    
    if (order.customer.notes) {
        message += `Notes: ${order.customer.notes}\n`;
    }
    
    message += `\n🛒 *Order Items:*\n`;
    order.items.forEach((item, index) => {
        message += `${index + 1}. ${item.name} x ${item.quantity} - Rs. ${item.price * item.quantity}\n`;
    });
    
    message += `\n💰 *Payment Summary:*\n`;
    message += `Subtotal: Rs. ${order.subtotal}\n`;
    message += `Delivery Fee: Rs. ${order.deliveryFee}\n`;
    message += `*Total: Rs. ${order.total}*\n\n`;
    message += `Please prepare and dispatch this order. 🚀`;
    
    return message;
}

// Send WhatsApp notification
async function sendWhatsAppNotification(phoneNumber, message) {
    if (!twilioClient) {
        console.error('Twilio client not initialized. Please check your environment variables.');
        throw new Error('WhatsApp service not configured');
    }
    
    try {
        const messageResponse = await twilioClient.messages.create({
            body: message,
            from: twilioWhatsAppNumber,
            to: phoneNumber
        });
        
        console.log(`WhatsApp message sent to ${phoneNumber}. SID: ${messageResponse.sid}`);
        return messageResponse;
    } catch (error) {
        console.error(`Error sending WhatsApp to ${phoneNumber}:`, error.message);
        throw error;
    }
}

// API endpoint to send order notifications
app.post('/api/send-order-notification', async (req, res) => {
    try {
        const { order } = req.body;
        
        if (!order) {
            return res.status(400).json({ 
                success: false, 
                error: 'Order data is required' 
            });
        }
        
        // Check if Twilio is configured
        if (!accountSid || !authToken || !twilioWhatsAppNumber) {
            console.warn('WhatsApp notifications not configured. Skipping...');
            return res.json({ 
                success: true, 
                message: 'Order received (WhatsApp not configured)',
                notifications: []
            });
        }
        
        const message = formatOrderMessage(order);
        const notifications = [];
        const errors = [];
        
        // Send to admin
        if (adminPhone) {
            try {
                const adminNotification = await sendWhatsAppNotification(adminPhone, message);
                notifications.push({
                    recipient: 'admin',
                    phone: adminPhone,
                    sid: adminNotification.sid,
                    status: 'sent'
                });
            } catch (error) {
                errors.push({
                    recipient: 'admin',
                    phone: adminPhone,
                    error: error.message
                });
            }
        }
        
        // Send to partner
        if (partnerPhone && partnerPhone !== adminPhone) {
            try {
                const partnerNotification = await sendWhatsAppNotification(partnerPhone, message);
                notifications.push({
                    recipient: 'partner',
                    phone: partnerPhone,
                    sid: partnerNotification.sid,
                    status: 'sent'
                });
            } catch (error) {
                errors.push({
                    recipient: 'partner',
                    phone: partnerPhone,
                    error: error.message
                });
            }
        }
        
        // Return response
        if (notifications.length > 0) {
            res.json({ 
                success: true, 
                message: 'WhatsApp notifications sent successfully',
                notifications,
                errors: errors.length > 0 ? errors : undefined
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to send any notifications',
                errors
            });
        }
        
    } catch (error) {
        console.error('Error in send-order-notification:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    const twilioConfigured = !!(accountSid && authToken && twilioWhatsAppNumber);
    res.json({ 
        status: 'ok',
        twilioConfigured,
        adminPhoneConfigured: !!adminPhone,
        partnerPhoneConfigured: !!partnerPhone
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 WhatsApp notification service ${twilioClient ? 'ENABLED' : 'DISABLED'}`);
    if (!twilioClient) {
        console.log('⚠️  Please configure Twilio credentials in .env file');
    }
});
