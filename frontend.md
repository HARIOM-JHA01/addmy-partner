# Partner Frontend - Pages & API Reference

**Document Version**: 2025-11-17  
**Backend Base URL**: `process.env.API_BASE_URL` (replace with actual domain)

---

## Pages to Create

### 1. Login Page

**Route**: `/partner/login`  
**Purpose**: Authenticate partner via Telegram  
**UI Elements**: Telegram login button, callback handler, redirect to dashboard on success

### 2. Dashboard Page

**Route**: `/partner/dashboard`  
**Purpose**: Display partner stats, credits, user metrics, and quick actions  
**UI Elements**: Credit cards (user/renewal credits), stats cards (total users, active, expired, renewals), pending payments count, referral URL display with copy button

### 3. Profile Page

**Route**: `/partner/profile`  
**Purpose**: View partner profile and referral details  
**UI Elements**: Display name, username, email, tgid, referral code, referral URL, credit balances, join date

### 4. Packages List Page

**Route**: `/partner/packages`  
**Purpose**: Browse and purchase partner packages  
**UI Elements**: Package cards showing name, type, credits, price, discount, "Buy Now" button that opens purchase modal

### 5. Purchase Modal/Page

**Route**: Modal or `/partner/purchase`  
**Purpose**: Submit USDT payment for package purchase  
**UI Elements**: Package summary, USDT payment instructions, transaction ID input, wallet address input, Submit button

### 6. Payment History Page

**Route**: `/partner/payments`  
**Purpose**: View all package purchase payments and their status  
**UI Elements**: Paginated table with date, package name, amount, transaction ID, status badge (pending/approved/rejected), pagination controls

### 7. Users List Page

**Route**: `/partner/users`  
**Purpose**: View all users joined via this partner  
**UI Elements**: Data table with username, name, join date, expiry date, status (active/expired), days until expiry, renewal count, "View Details" button, status filter dropdown (all/active/expired), pagination

### 8. User Detail Page

**Route**: `/partner/users/:id`  
**Purpose**: View detailed user info and perform renewal  
**UI Elements**: User profile card (name, username, tgid, email, contact), membership status card (expiry date, days remaining, renewal count, last renewal info), "Renew Membership" button

### 9. Renew Membership Modal

**Route**: Modal triggered from User Detail  
**Purpose**: Renew user membership using partner credits  
**UI Elements**: User summary, dropdown to select renewal months, display available credits and cost, Confirm button

---

## API Endpoints & CURL Examples

### 1. Partner Login (Telegram)

**Endpoint**: `POST /telegram-login`  
**Authentication**: None (public endpoint)

**Request Body**:

```json
{
  "tgid": "123456789",
  "name": "John Partner",
  "username": "johnpartner",
  "email": "john@example.com"
}
```

**CURL**:

```bash
curl -X POST https://your-api-domain.com/telegram-login \
  -H "Content-Type: application/json" \
  -d '{
    "tgid": "123456789",
    "name": "John Partner",
    "username": "johnpartner",
    "email": "john@example.com"
  }'
```

**Success Response** (200):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "partner": {
      "id": "673a1b2c3d4e5f6g7h8i9j0k",
      "name": "John Partner",
      "tgid": "123456789",
      "username": "johnpartner",
      "referralCode": "A1B2C3D4E5F6",
      "referralUrl": "https://your-domain.com?ref=A1B2C3D4E5F6",
      "userCredits": 10,
      "usedUserCredits": 0,
      "renewalCredits": 5,
      "usedRenewalCredits": 0,
      "isReferralActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (422):

```json
{
  "success": false,
  "errors": {
    "tgid": {
      "message": "The tgid field is required.",
      "rule": "required"
    }
  }
}
```

---

### 2. Get Partner Profile

**Endpoint**: `GET /profile`  
**Authentication**: Required (Bearer token)

**CURL**:

```bash
curl -X GET https://your-api-domain.com/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "id": "673a1b2c3d4e5f6g7h8i9j0k",
    "name": "John Partner",
    "tgid": "123456789",
    "username": "johnpartner",
    "email": "john@example.com",
    "referralCode": "A1B2C3D4E5F6",
    "referralUrl": "https://your-domain.com?ref=A1B2C3D4E5F6",
    "userCredits": 10,
    "usedUserCredits": 3,
    "availableUserCredits": 7,
    "renewalCredits": 5,
    "usedRenewalCredits": 1,
    "availableRenewalCredits": 4,
    "isReferralActive": true,
    "joinDate": "2025-11-01T10:00:00.000Z",
    "lastActive": "2025-11-17T14:30:00.000Z"
  }
}
```

---

### 3. Get Available Packages

**Endpoint**: `GET /packages`  
**Authentication**: Required (Bearer token)

**CURL**:

```bash
curl -X GET https://your-api-domain.com/packages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "_id": "pkg001",
      "name": "Starter Package",
      "type": "USER_CREDITS",
      "credits": 10,
      "price": 100,
      "discount": 0,
      "finalPrice": 100,
      "description": "10 user registration credits",
      "status": 1
    },
    {
      "_id": "pkg002",
      "name": "Renewal Package",
      "type": "RENEWAL_CREDITS",
      "credits": 5,
      "renewalMonths": 6,
      "price": 50,
      "discount": 10,
      "finalPrice": 45,
      "description": "5 renewal credits for 6-month renewals",
      "status": 1
    }
  ]
}
```

---

### 4. Purchase Package

**Endpoint**: `POST /purchase-package`  
**Authentication**: Required (Bearer token)

**Request Body**:

```json
{
  "packageId": "pkg001",
  "transactionId": "0x1a2b3c4d5e6f7g8h9i0j",
  "walletAddress": "TXyz123abc456def789"
}
```

**CURL**:

```bash
curl -X POST https://your-api-domain.com/purchase-package \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "packageId": "pkg001",
    "transactionId": "0x1a2b3c4d5e6f7g8h9i0j",
    "walletAddress": "TXyz123abc456def789"
  }'
```

**Success Response** (200):

```json
{
  "success": true,
  "message": "Payment submitted successfully. Waiting for admin approval.",
  "data": {
    "paymentId": "pay001",
    "amount": 100,
    "credits": 10,
    "status": "pending"
  }
}
```

**Error Response** (400 - Duplicate Transaction):

```json
{
  "success": false,
  "message": "Transaction ID already used"
}
```

**Error Response** (404 - Package Not Found):

```json
{
  "success": false,
  "message": "Package not found"
}
```

---

### 5. Get Payment History

**Endpoint**: `GET /payment-history?page=1&limit=20`  
**Authentication**: Required (Bearer token)

**CURL**:

```bash
curl -X GET "https://your-api-domain.com/payment-history?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "_id": "pay001",
        "package": {
          "_id": "pkg001",
          "name": "Starter Package",
          "type": "USER_CREDITS",
          "credits": 10
        },
        "amount": 100,
        "credits": 10,
        "transactionId": "0x1a2b3c4d5e6f7g8h9i0j",
        "walletAddress": "TXyz123abc456def789",
        "status": 0,
        "paymentStatus": 0,
        "createdAt": "2025-11-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalRecords": 45,
      "limit": 20
    }
  }
}
```

---

### 6. Get Dashboard Stats

**Endpoint**: `GET /dashboard`  
**Authentication**: Required (Bearer token)

**CURL**:

```bash
curl -X GET https://your-api-domain.com/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "credits": {
      "userCredits": 10,
      "usedUserCredits": 3,
      "availableUserCredits": 7,
      "renewalCredits": 5,
      "usedRenewalCredits": 1,
      "availableRenewalCredits": 4
    },
    "referral": {
      "referralCode": "A1B2C3D4E5F6",
      "referralUrl": "https://your-domain.com?ref=A1B2C3D4E5F6",
      "isActive": true
    },
    "users": {
      "total": 25,
      "active": 18,
      "expired": 7,
      "joinedThisMonth": 5
    },
    "renewals": {
      "total": 12
    },
    "payments": {
      "pending": 2
    }
  }
}
```

---

### 7. Get My Users (List)

**Endpoint**: `GET /users?page=1&limit=20&status=active`  
**Authentication**: Required (Bearer token)  
**Query Parameters**:

- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `status` (optional): `active` | `expired` | omit for all

**CURL**:

```bash
curl -X GET "https://your-api-domain.com/users?page=1&limit=20&status=active" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "pu001",
        "userId": "user001",
        "username": "johndoe",
        "name": "John Doe",
        "tgid": "987654321",
        "joinDate": "2025-11-10T08:00:00.000Z",
        "membershipExpiryDate": "2026-05-10T08:00:00.000Z",
        "isExpired": false,
        "daysUntilExpiry": 174,
        "renewalCount": 2,
        "lastRenewalDate": "2025-11-12T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalRecords": 25,
      "limit": 20
    }
  }
}
```

---

### 8. Get User Details

**Endpoint**: `GET /users/:partnerUserId`  
**Authentication**: Required (Bearer token)

**CURL**:

```bash
curl -X GET https://your-api-domain.com/users/pu001 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "id": "pu001",
    "user": {
      "id": "user001",
      "username": "johndoe",
      "nameEnglish": "John Doe",
      "nameChinese": "约翰·多伊",
      "tgid": "987654321",
      "email": "john.doe@example.com",
      "contact": "+1234567890"
    },
    "joinDate": "2025-11-10T08:00:00.000Z",
    "membershipExpiryDate": "2026-05-10T08:00:00.000Z",
    "isExpired": false,
    "daysUntilExpiry": 174,
    "renewalCount": 2,
    "lastRenewalDate": "2025-11-12T10:00:00.000Z",
    "lastRenewalBy": "PARTNER"
  }
}
```

**Error Response** (404):

```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 9. Get Renewal Prices

**Endpoint**: `GET /renewal-prices`  
**Authentication**: Required (Bearer token)

**CURL**:

```bash
curl -X GET https://your-api-domain.com/renewal-prices \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "_id": "rp001",
      "membershipMonths": 1,
      "creditCost": 1,
      "description": "1 month renewal",
      "status": 1
    },
    {
      "_id": "rp002",
      "membershipMonths": 3,
      "creditCost": 1,
      "description": "3 months renewal",
      "status": 1
    },
    {
      "_id": "rp003",
      "membershipMonths": 6,
      "creditCost": 1,
      "description": "6 months renewal",
      "status": 1
    }
  ]
}
```

---

### 10. Renew User Membership

**Endpoint**: `POST /renew-membership`  
**Authentication**: Required (Bearer token)

**Request Body**:

```json
{
  "partnerUserId": "pu001",
  "months": 6
}
```

**CURL**:

```bash
curl -X POST https://your-api-domain.com/renew-membership \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "partnerUserId": "pu001",
    "months": 6
  }'
```

**Success Response** (200):

```json
{
  "success": true,
  "message": "Membership renewed successfully for 6 month(s)",
  "data": {
    "userId": "user001",
    "username": "johndoe",
    "newExpiryDate": "2026-11-10T08:00:00.000Z",
    "remainingCredits": 3,
    "renewalCount": 3
  }
}
```

**Error Response** (400 - Insufficient Credits):

```json
{
  "success": false,
  "message": "Insufficient renewal credits. Please purchase renewal credits.",
  "requiresPayment": true
}
```

**Error Response** (404 - User Not Found):

```json
{
  "success": false,
  "message": "User not found in your network"
}
```

**Error Response** (404 - Price Not Configured):

```json
{
  "success": false,
  "message": "Renewal price for 6 months not configured"
}
```

---

## Authentication

All endpoints except `/telegram-login` require Bearer token authentication.

**Header Format**:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

The token is returned in the login response and should be stored securely (localStorage/sessionStorage) and included in all subsequent requests.

---

## Error Handling

All endpoints follow a consistent error response format:

**Validation Error** (422):

```json
{
  "success": false,
  "errors": {
    "fieldName": {
      "message": "Error message",
      "rule": "validation_rule"
    }
  }
}
```

**Server Error** (500):

```json
{
  "success": false,
  "message": "Server error",
  "error": "Detailed error message (in dev mode)"
}
```

---

## Notes for Frontend Implementation

1. **Token Management**: Store JWT token after login and attach to all requests
2. **Status Mapping**:
   - Payment status: `0` = pending, `1` = approved, `2` = rejected
   - Package status: `1` = active
3. **Pagination**: All list endpoints support `page` and `limit` query params
4. **Date Formatting**: All dates are ISO 8601 strings; parse with `new Date()` or moment.js
5. **Credits Display**: Show both total and available credits (total - used)
6. **Renewal Flow**: Check available credits before showing renewal UI
7. **Payment Instructions**: Display USDT payment address and instructions on purchase modal
8. **Real-time Updates**: Consider polling `/dashboard` every 30-60 seconds for updated stats

---

**End of Document**
