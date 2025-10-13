import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email template wrapper
const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .otp-code { background: #fff; border: 2px dashed #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 8px; }
    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} New Broker. All rights reserved.</p>
      <p>This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

// Send OTP Email
export async function sendOTPEmail(to: string, otp: string, type: string) {
  const typeMessages: Record<string, { subject: string; message: string }> = {
    verify: {
      subject: 'Verify Your Email Address',
      message: 'Thank you for signing up! Please verify your email address to activate your account.',
    },
    reset: {
      subject: 'Reset Your Password',
      message: 'We received a request to reset your password. Use the code below to proceed.',
    },
    withdraw: {
      subject: 'Confirm Withdrawal Request',
      message: 'Please confirm your withdrawal request with the verification code below.',
    },
    trade_confirm: {
      subject: 'Confirm Trading Action',
      message: 'Please confirm your trading action with the verification code below.',
    },
    '2fa': {
      subject: 'Two-Factor Authentication Code',
      message: 'Your two-factor authentication code is below.',
    },
  };

  const { subject, message } = typeMessages[type] || typeMessages.verify;

  const content = emailTemplate(`
    <div class="header">
      <h1>🔐 Verification Code</h1>
    </div>
    <div class="content">
      <p>${message}</p>
      <div class="otp-code">${otp}</div>
      <p><strong>This code will expire in 10 minutes.</strong></p>
      <p>If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
    </div>
  `);

  try {
    await transporter.sendMail({
      from: `"New Broker" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html: content,
    });
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Send Welcome Email
export async function sendWelcomeEmail(to: string, name: string) {
  const content = emailTemplate(`
    <div class="header">
      <h1>🎉 Welcome to New Broker!</h1>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>Welcome aboard! We're excited to have you join our community of traders and investors.</p>
      <p>Your account has been successfully created and verified. You can now:</p>
      <ul>
        <li>✅ Trade cryptocurrencies and stocks</li>
        <li>✅ Stake assets and earn rewards</li>
        <li>✅ Invest in curated portfolios</li>
        <li>✅ Track your performance in real-time</li>
      </ul>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
      <p>If you have any questions, our support team is here to help!</p>
    </div>
  `);

  try {
    await transporter.sendMail({
      from: `"New Broker" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: 'Welcome to New Broker! 🚀',
      html: content,
    });
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Send Password Reset Confirmation
export async function sendPasswordResetConfirmation(to: string, name: string) {
  const content = emailTemplate(`
    <div class="header">
      <h1>✅ Password Reset Successful</h1>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>Your password has been successfully reset.</p>
      <p>If you didn't make this change, please contact our support team immediately.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/login" class="button">Login Now</a>
    </div>
  `);

  try {
    await transporter.sendMail({
      from: `"New Broker" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: 'Password Reset Successful',
      html: content,
    });
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Send Withdrawal Notification
export async function sendWithdrawalNotification(
  to: string,
  amount: string,
  asset: string,
  address: string
) {
  const content = emailTemplate(`
    <div class="header">
      <h1>💸 Withdrawal Processed</h1>
    </div>
    <div class="content">
      <p>Your withdrawal request has been processed successfully.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li>Amount: ${amount} ${asset}</li>
        <li>Destination: ${address.substring(0, 10)}...${address.substring(address.length - 10)}</li>
        <li>Status: Processing</li>
      </ul>
      <p>The transaction will be confirmed shortly. You can track its status in your dashboard.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/history" class="button">View Transaction</a>
    </div>
  `);

  try {
    await transporter.sendMail({
      from: `"New Broker" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: 'Withdrawal Processed',
      html: content,
    });
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Verify transporter configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email server configuration error:', error);
    return false;
  }
}
