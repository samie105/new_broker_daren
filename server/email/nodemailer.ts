import nodemailer from 'nodemailer';

// =============================================================================
// CONFIGURATION
// =============================================================================

const BRAND = {
  name: 'Atlantic Pacific Capital',
  primaryColor: '#0D3453',
  accentColor: '#0A2840',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// =============================================================================
// TRANSPORTER
// =============================================================================

const transporter = nodemailer.createTransport(SMTP_CONFIG);

const getFromAddress = () => 
  `"${BRAND.name}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`;

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND.name}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
          ${content}
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; color: #6b7280; font-size: 12px;">
              <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</p>
              <p style="margin: 0; color: #9ca3af;">This is an automated message. Please do not reply directly to this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const templates = {
  otp: (otp: string, title: string, message: string) => baseTemplate(`
    <!-- Header -->
    <tr>
      <td style="background: ${BRAND.primaryColor}; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">🔐 ${title}</h1>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">${message}</p>
        
        <!-- OTP Code Box -->
        <div style="background: #f3f4f6; border: 2px dashed ${BRAND.primaryColor}; border-radius: 8px; padding: 25px; text-align: center; margin: 25px 0;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: ${BRAND.accentColor};">${otp}</span>
        </div>
        
        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;"><strong>⏰ This code expires in 15 minutes.</strong></p>
        <p style="margin: 0; color: #9ca3af; font-size: 13px;">If you didn't request this code, you can safely ignore this email.</p>
      </td>
    </tr>
  `),

  welcome: (name: string) => baseTemplate(`
    <!-- Header -->
    <tr>
      <td style="background: ${BRAND.primaryColor}; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">🎉 Welcome to ${BRAND.name}!</h1>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
        <p style="margin: 0 0 25px 0; color: #374151; font-size: 16px; line-height: 1.6;">Welcome aboard! We're thrilled to have you join our community of traders and investors.</p>
        
        <p style="margin: 0 0 15px 0; color: #374151; font-size: 16px; font-weight: 600;">You can now:</p>
        <ul style="margin: 0 0 25px 0; padding-left: 20px; color: #374151; font-size: 15px; line-height: 1.8;">
          <li>📈 Trade cryptocurrencies and stocks</li>
          <li>💰 Stake assets and earn rewards</li>
          <li>📊 Invest in curated portfolios</li>
          <li>⚡ Track your performance in real-time</li>
        </ul>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${BRAND.appUrl}/dashboard" style="display: inline-block; background: ${BRAND.primaryColor}; color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-weight: 600; font-size: 16px;">Go to Dashboard →</a>
        </div>
        
        <p style="margin: 0; color: #6b7280; font-size: 14px;">Need help? Our support team is always here for you.</p>
      </td>
    </tr>
  `),

  passwordResetConfirmation: (name: string) => baseTemplate(`
    <!-- Header -->
    <tr>
      <td style="background: ${BRAND.primaryColor}; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">✅ Password Reset Successful</h1>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
        <p style="margin: 0 0 25px 0; color: #374151; font-size: 16px; line-height: 1.6;">Your password has been successfully reset. You can now log in with your new password.</p>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${BRAND.appUrl}/auth/login" style="display: inline-block; background: ${BRAND.primaryColor}; color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-weight: 600; font-size: 16px;">Login Now →</a>
        </div>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-top: 20px;">
          <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>⚠️ Didn't make this change?</strong> Contact our support team immediately.</p>
        </div>
      </td>
    </tr>
  `),

  withdrawal: (amount: string, asset: string, address: string) => baseTemplate(`
    <!-- Header -->
    <tr>
      <td style="background: ${BRAND.primaryColor}; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">💸 Withdrawal Processed</h1>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <p style="margin: 0 0 25px 0; color: #374151; font-size: 16px; line-height: 1.6;">Your withdrawal request has been submitted and is being processed.</p>
        
        <!-- Transaction Details -->
        <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="8">
            <tr>
              <td style="color: #6b7280; font-size: 14px;">Amount</td>
              <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${amount} ${asset}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; font-size: 14px;">Destination</td>
              <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right; font-family: monospace;">${address.slice(0, 8)}...${address.slice(-8)}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; font-size: 14px;">Status</td>
              <td style="text-align: right;"><span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">Processing</span></td>
            </tr>
          </table>
        </div>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${BRAND.appUrl}/dashboard/history" style="display: inline-block; background: ${BRAND.primaryColor}; color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-weight: 600; font-size: 16px;">View Transaction →</a>
        </div>
        
        <p style="margin: 0; color: #6b7280; font-size: 14px;">The transaction will be confirmed on the blockchain shortly.</p>
      </td>
    </tr>
  `),
};

// =============================================================================
// OTP MESSAGE TYPES
// =============================================================================

const OTP_TYPES: Record<string, { subject: string; title: string; message: string }> = {
  verify: {
    subject: 'Verify Your Email Address',
    title: 'Email Verification',
    message: 'Thank you for signing up! Use the code below to verify your email address.',
  },
  reset: {
    subject: 'Reset Your Password',
    title: 'Password Reset',
    message: 'We received a request to reset your password. Use the code below to proceed.',
  },
  withdraw: {
    subject: 'Confirm Withdrawal Request',
    title: 'Withdrawal Confirmation',
    message: 'Please confirm your withdrawal request using the code below.',
  },
  trade_confirm: {
    subject: 'Confirm Trading Action',
    title: 'Trade Confirmation',
    message: 'Please confirm your trading action using the code below.',
  },
  '2fa': {
    subject: 'Two-Factor Authentication',
    title: '2FA Code',
    message: 'Your two-factor authentication code is below.',
  },
};

// =============================================================================
// EMAIL SENDER UTILITY
// =============================================================================

interface EmailResult {
  success: boolean;
  error?: string;
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  logContext: Record<string, unknown>
): Promise<EmailResult> {
  const from = getFromAddress();
  
  console.log('📧 [EMAIL] Sending...', {
    to,
    subject,
    from,
    ...logContext,
    timestamp: new Date().toISOString(),
  });

  try {
    const info = await transporter.sendMail({ from, to, subject, html });
    
    console.log('✅ [EMAIL] Sent successfully', {
      to,
      subject,
      messageId: info.messageId,
      ...logContext,
    });
    
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    const errorStack = err instanceof Error ? err.stack : undefined;
    
    console.error('❌ [EMAIL] Failed to send', {
      to,
      subject,
      error: errorMessage,
      stack: errorStack,
      smtpConfig: {
        host: SMTP_CONFIG.host,
        port: SMTP_CONFIG.port,
        secure: SMTP_CONFIG.secure,
        user: SMTP_CONFIG.auth.user ? '***configured***' : '***missing***',
        pass: SMTP_CONFIG.auth.pass ? '***configured***' : '***missing***',
      },
      ...logContext,
    });
    
    return { success: false, error: errorMessage };
  }
}

// =============================================================================
// PUBLIC EMAIL FUNCTIONS
// =============================================================================

export async function sendOTPEmail(
  to: string,
  otp: string,
  type: string
): Promise<EmailResult> {
  const config = OTP_TYPES[type] || OTP_TYPES.verify;
  const html = templates.otp(otp, config.title, config.message);
  
  return sendEmail(to, config.subject, html, { type, otpLength: otp.length });
}

export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<EmailResult> {
  const html = templates.welcome(name);
  
  return sendEmail(to, `Welcome to ${BRAND.name}! 🚀`, html, { type: 'welcome', name });
}

export async function sendPasswordResetConfirmation(
  to: string,
  name: string
): Promise<EmailResult> {
  const html = templates.passwordResetConfirmation(name);
  
  return sendEmail(to, 'Password Reset Successful', html, { type: 'password_reset', name });
}

export async function sendWithdrawalNotification(
  to: string,
  amount: string,
  asset: string,
  address: string
): Promise<EmailResult> {
  const html = templates.withdrawal(amount, asset, address);
  
  return sendEmail(to, 'Withdrawal Processed', html, { type: 'withdrawal', amount, asset });
}

// =============================================================================
// CONFIGURATION VERIFICATION
// =============================================================================

export async function verifyEmailConfig(): Promise<boolean> {
  console.log('🔧 [EMAIL] Verifying SMTP configuration...', {
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    secure: SMTP_CONFIG.secure,
    user: SMTP_CONFIG.auth.user ? '***configured***' : '***missing***',
    pass: SMTP_CONFIG.auth.pass ? '***configured***' : '***missing***',
  });

  try {
    await transporter.verify();
    console.log('✅ [EMAIL] SMTP server connection verified');
    return true;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ [EMAIL] SMTP verification failed:', errorMessage);
    return false;
  }
}
