# PRODUCTION DEPLOYMENT GUIDE

## 🚀 Supabase Auth Configuration for Production

### 1. Configure Supabase Dashboard

Go to your Supabase Dashboard → Authentication → URL Configuration:

#### **Site URL:**
```
https://wineclub.justaskarc.com
```

#### **Redirect URLs (Add these):**
```
https://wineclub.justaskarc.com/auth/callback
https://wineclub.justaskarc.com/auth/reset-password
```

### 2. Update Email Templates

In Supabase Dashboard → Authentication → Email Templates:

#### **Magic Link Template:**
```
Subject: Your magic link for Wine Club SaaS

Click the link below to sign in to your wine club:
{{ .ConfirmationURL }}

This link will expire in 1 hour.

If you didn't request this link, please ignore this email.
```

#### **Password Reset Template:**
```
Subject: Reset your Wine Club SaaS password

Click the link below to reset your password:
{{ .ConfirmationURL }}

This link will expire in 1 hour.

If you didn't request this reset, please ignore this email.
```

### 3. Environment Variables

Create a `.env.production` file or set these in your deployment platform:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://aammkgdhfmkukpqkdduj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhbW1rZ2RoZm1rdWtwcWtkZHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzgxNTIsImV4cCI6MjA3NTAxNDE1Mn0.V-9vkcctLQ8flXrdc50c3ghIHhxnNGsKl6HfvXHzlY8

# Production Domain
VITE_APP_URL=https://wineclub.justaskarc.com
```

### 4. Vercel Deployment Configuration

#### **vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "https://aammkgdhfmkukpqkdduj.supabase.co",
    "VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhbW1rZ2RoZm1rdWtwcWtkZHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzgxNTIsImV4cCI6MjA3NTAxNDE1Mn0.V-9vkcctLQ8flXrdc50c3ghIHhxnNGsKl6HfvXHzlY8"
  }
}
```

### 5. Domain Setup

#### **DNS Configuration:**
- Point `wineclub.justaskarc.com` to your Vercel deployment
- Ensure SSL certificate is enabled
- Verify HTTPS is working

#### **Vercel Domain Setup:**
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add `wineclub.justaskarc.com`
3. Configure DNS records as instructed by Vercel

### 6. Test Production Authentication

#### **Magic Link Test:**
1. Go to `https://wineclub.justaskarc.com`
2. Click "Magic Link" tab
3. Enter email: `klausbellinghausen@gmail.com`
4. Check email for magic link
5. Click link → should redirect to wine club dashboard

#### **Password Reset Test:**
1. Click "Forgot your password?"
2. Enter email: `demo@wineclub.com`
3. Check email for reset link
4. Click link → should redirect to password reset page

#### **SaaS Admin Test:**
1. Login with: `jimmy@arccom.io` / `admin123`
2. Should redirect to SaaS Admin Dashboard
3. Test account switching in lower left dropdown

### 7. Security Considerations

#### **Enable Email Confirmations (Optional):**
- In Supabase → Authentication → Settings
- Enable "Confirm email" for new signups
- This requires users to verify their email before first login

#### **Rate Limiting:**
- Supabase has built-in rate limiting
- Magic links: 3 per hour per email
- Password resets: 3 per hour per email

#### **CORS Configuration:**
- Supabase automatically handles CORS for configured domains
- No additional CORS setup needed

### 8. Monitoring & Analytics

#### **Supabase Dashboard:**
- Monitor authentication events
- Check email delivery rates
- Review failed login attempts

#### **Vercel Analytics:**
- Track page views and user behavior
- Monitor performance metrics
- Set up alerts for errors

### 9. Backup & Recovery

#### **Database Backups:**
- Supabase provides automatic daily backups
- Configure point-in-time recovery if needed
- Export user data regularly

#### **Code Deployment:**
- Use Git tags for releases
- Keep deployment history
- Test rollback procedures

## 🚨 Troubleshooting

### Magic Links Not Working:
1. Check Supabase redirect URLs include production domain
2. Verify email templates are configured
3. Check spam folder
4. Test with different email providers

### Password Reset Issues:
1. Verify reset template configuration
2. Check redirect URL in Supabase
3. Ensure user exists in auth.users table

### Domain Issues:
1. Verify DNS propagation
2. Check SSL certificate status
3. Test HTTPS redirect
4. Verify Vercel domain configuration

## 📞 Support

If you encounter issues:
1. Check Supabase Dashboard → Logs
2. Review Vercel deployment logs
3. Test authentication flow step by step
4. Verify all URLs are correctly configured
