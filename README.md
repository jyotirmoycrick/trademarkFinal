# WebDesert Legal Services Platform

A premium, mobile-first legal services web application for India offering Trademark Registration, GST Registration, and Company Registration.

## Features

- **Service Catalog**: Browse and select legal services
- **Shopping Cart**: Add multiple services with quantity management
- **User Authentication**: Secure JWT-based registration and login
- **Checkout Flow**: Multi-step checkout with order review
- **Payment Integration**: Razorpay payment gateway support
- **User Dashboard**: Track orders and service status
- **Responsive Design**: Mobile-first, corporate premium design

## Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, Zustand
- **Backend**: FastAPI, Python
- **Database**: MongoDB
- **Payment**: Razorpay

## Setup Instructions

### Backend Configuration

1. Update `/app/backend/.env` with your credentials:

```env
# MongoDB Configuration (Pre-configured)
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"

# JWT Configuration
JWT_SECRET="your-secret-key-here"
JWT_ALGORITHM="HS256"
JWT_EXPIRATION_HOURS="720"

# Razorpay Configuration (REQUIRED FOR PAYMENTS)
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

2. Get Razorpay Credentials:
   - Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - For testing: Use Test Mode credentials from Settings > API Keys
   - For production: Generate Live Mode credentials after KYC verification

3. Restart services:
```bash
sudo supervisorctl restart backend
```

### Frontend Configuration

The frontend is pre-configured to use the backend URL. No additional setup required.

## Testing

### Test Credentials for Demo

**Test User:**
- Email: testuser@example.com
- Password: password123

**Coupon Codes:**
- `LAUNCH50` - 5% discount on orders

### Test Payment Cards (Razorpay Test Mode)

- **Card Number**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## Services Offered

1. **Trademark Registration** - ₹1,000 + Government Fees
2. **GST Registration** - ₹999
3. **Company Registration** - ₹4,999 + Government Fees

## Important Notes

- **Razorpay Integration**: The platform uses test Razorpay credentials by default. For production use, you must:
  1. Create a Razorpay account
  2. Complete KYC verification
  3. Generate live API credentials
  4. Update backend/.env with live credentials

- **WhatsApp Integration**: Update the WhatsApp number in `/app/frontend/src/components/Header.js` (Line 47)

- **Logo**: WebDesert logo is displayed in header and redirects to https://webdesert.in

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires auth)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/{service_id}` - Get service details

### Orders
- `POST /api/orders/create` - Create order with Razorpay (requires auth)
- `POST /api/orders/verify-payment` - Verify Razorpay payment (requires auth)
- `GET /api/orders/my-orders` - Get user orders (requires auth)
- `GET /api/orders/{order_id}` - Get order details (requires auth)

## Troubleshooting

### Payment Gateway Errors

If you see "Authentication failed" errors:
1. Verify Razorpay credentials in `/app/backend/.env`
2. Ensure you're using the correct mode (Test vs Live)
3. Check Razorpay dashboard for API key status
4. Restart backend after updating credentials

### Cart Not Persisting

Cart items are stored in browser localStorage. If items disappear:
1. Check browser console for errors
2. Ensure cookies/localStorage are enabled
3. Try clearing browser cache and reloading

## Production Deployment Checklist

- [ ] Update Razorpay credentials with live keys
- [ ] Update JWT_SECRET with a strong secret
- [ ] Update WhatsApp business number
- [ ] Configure email notifications (optional)
- [ ] Set up SSL certificate
- [ ] Enable production CORS origins
- [ ] Test complete user journey
- [ ] Set up monitoring and logging

## Support

For technical support or queries:
- WhatsApp: +91 98765 43210 (Update with actual number)
- Website: https://webdesert.in

## License

Proprietary - WebDesert Legal Services Platform
