# SUPABASE AUTH SETUP GUIDE

## 🔧 Required Supabase Configuration

### 1. Enable Email Authentication
In your Supabase Dashboard → Authentication → Settings:

✅ **Enable email confirmations**: OFF (for development)
✅ **Enable email change confirmations**: OFF (for development)
✅ **Enable phone confirmations**: OFF

### 2. Configure Email Templates
In Supabase Dashboard → Authentication → Email Templates:

#### **Magic Link Template:**
```
Subject: Your magic link for Wine Club SaaS

Click the link below to sign in:
{{ .ConfirmationURL }}

This link will expire in 1 hour.
```

#### **Password Reset Template:**
```
Subject: Reset your Wine Club SaaS password

Click the link below to reset your password:
{{ .ConfirmationURL }}

This link will expire in 1 hour.
```

### 3. Set Site URL
In Supabase Dashboard → Authentication → URL Configuration:

#### **Development:**
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: 
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/auth/reset-password`

#### **Production:**
- **Site URL**: `https://wineclub.justaskarc.com`
- **Redirect URLs**: 
  - `https://wineclub.justaskarc.com/auth/callback`
  - `https://wineclub.justaskarc.com/auth/reset-password`

### 4. Create Test Users
Run this SQL in Supabase SQL Editor:

```sql
-- Create test users for authentication
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  -- SaaS Parent Admin
  (uuid_generate_v4(), 'jimmy@arccom.io', crypt('admin123', gen_salt('bf')), NOW(), NOW(), NOW()),
  
  -- King Frosch Owner  
  (uuid_generate_v4(), 'klausbellinghausen@gmail.com', crypt('kingfrosch123', gen_salt('bf')), NOW(), NOW(), NOW()),
  
  -- Demo Wine Club Admin
  (uuid_generate_v4(), 'demo@wineclub.com', crypt('demo123', gen_salt('bf')), NOW(), NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
```

### 5. Test Authentication Flow

#### **Password Login:**
1. Go to `http://localhost:3000`
2. Enter email: `jimmy@arccom.io`
3. Enter password: `admin123`
4. Should redirect to SaaS Admin Dashboard

#### **Magic Link:**
1. Go to Magic Link tab
2. Enter email: `klausbellinghausen@gmail.com`
3. Check email for magic link
4. Click link → redirects to Wine Club Dashboard

#### **Password Reset:**
1. Click "Forgot your password?"
2. Enter email: `demo@wineclub.com`
3. Check email for reset link
4. Click link → redirects to password reset page

### 6. Account Switching (SaaS Admin)

Once logged in as SaaS Parent Admin:
1. Look in lower left sidebar
2. Click "SaaS Parent Admin" dropdown
3. Select "Wine Club Demo (ID: 1)" or "King Frosch Login (ID: 2)"
4. Should switch to respective wine club context

### 7. Production Testing

#### **Test on Production Domain:**
1. Deploy to `https://wineclub.justaskarc.com`
2. Test magic link: `klausbellinghausen@gmail.com`
3. Test password reset: `demo@wineclub.com`
4. Test SaaS admin login: `jimmy@arccom.io`
5. Verify account switching works

#### **Production Checklist:**
- ✅ Supabase Site URL set to production domain
- ✅ Redirect URLs include production domain
- ✅ Email templates configured
- ✅ DNS pointing to Vercel deployment
- ✅ SSL certificate active
- ✅ All auth flows working

## 🚨 Troubleshooting

### Magic Link Not Working:
- Check Supabase email settings
- Verify Site URL and Redirect URLs
- Check spam folder
- Ensure email templates are configured

### Password Reset Not Working:
- Verify password reset template
- Check redirect URL configuration
- Ensure user exists in auth.users table

### Account Switching Issues:
- Verify wine club IDs in database
- Check ClientContext logic
- Ensure proper user role mapping

## 📧 Email Configuration (Optional)

For production, configure SMTP in Supabase:
- Go to Authentication → Settings → SMTP Settings
- Add your email provider credentials
- Test email delivery
