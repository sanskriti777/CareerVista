const nodemailer = require("nodemailer");

/**
 * Creates and returns a Nodemailer transporter if SMTP environment variables are configured.
 * Returns null if SMTP is not configured.
 */
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Sends a password reset email to the specified user.
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.name - Recipient user name
 * @param {string} options.resetUrl - Full URL pointing to the reset password page with token
 * @returns {Promise<{ delivered: boolean, simulated?: boolean, error?: string }>}
 */
const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const fromName = process.env.FROM_NAME || "CareerVista Support";
  const fromEmail = process.env.FROM_EMAIL || "noreply@careervista.com";
  const from = `"${fromName}" <${fromEmail}>`;
  const subject = "CareerVista — Password Reset Request";

  const safeName = name ? String(name).trim() : "Valued Member";

  const textContent = `Hello ${safeName},

We received a request to reset your password for your CareerVista account.

To choose a new password, open the link below in your browser:
${resetUrl}

Please note:
- This link is single-use and will expire in 15 minutes.
- If you did not request this password reset, no action is needed and your account remains secure.

Best regards,
The CareerVista Team
https://github.com/sanskriti777/CareerVista
`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your CareerVista Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%); padding: 36px 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.02em;">CareerVista</h1>
              <p style="color: #e0e7ff; margin: 8px 0 0; font-size: 14px; font-weight: 500;">Job Market Intelligence &amp; Career Recommendations</p>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 20px; font-weight: 600;">Password Reset Request</h2>
              <p style="margin: 0 0 16px; color: #334155; font-size: 15px;">Hello <strong>${safeName}</strong>,</p>
              <p style="margin: 0 0 24px; color: #475569; font-size: 15px;">
                We received a request to reset the password associated with your CareerVista account. Click the button below to set a new password:
              </p>
              <!-- Action Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 28px;">
                <tr>
                  <td align="center" style="border-radius: 10px; background: linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%);">
                    <a href="${resetUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 10px;">
                      Reset Your Password
                    </a>
                  </td>
                </tr>
              </table>
              <!-- Security Details Box -->
              <div style="background-color: #f1f5f9; border-left: 4px solid #6d28d9; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px; color: #0f172a; font-size: 13px; font-weight: 600;">Security Notice:</p>
                <ul style="margin: 0; padding-left: 18px; color: #475569; font-size: 13px;">
                  <li style="margin-bottom: 4px;">This link is single-use and will expire in <strong>15 minutes</strong>.</li>
                  <li>If you did not make this request, you can safely disregard this email. Your password will remain unchanged.</li>
                </ul>
              </div>
              <p style="margin: 0 0 8px; color: #64748b; font-size: 13px;">
                If the button above does not work, copy and paste the following URL into your web browser:
              </p>
              <p style="margin: 0; word-break: break-all; color: #6d28d9; font-size: 13px;">
                <a href="${resetUrl}" style="color: #6d28d9;">${resetUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center; color: #94a3b8; font-size: 12px;">
              <p style="margin: 0 0 4px;">&copy; ${new Date().getFullYear()} CareerVista Platform. All rights reserved.</p>
              <p style="margin: 0;">Deterministic, explainable career recommendation platform.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const transporter = getTransporter();

  if (!transporter) {
    // Development or test fallback: log clearly to the console
    if (process.env.NODE_ENV !== "production") {
      console.log("\n=======================================================");
      console.log("ℹ️ [CareerVista Email Service — Local Simulation]");
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Reset Link (Valid 15m): ${resetUrl}`);
      console.log("=======================================================\n");
    } else {
      console.warn(
        "[CareerVista Email Service] SMTP environment variables are unconfigured. Password reset email was not dispatched via SMTP."
      );
    }

    return {
      delivered: false,
      simulated: true,
      resetUrl,
    };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    return {
      delivered: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("[CareerVista Email Service] SMTP delivery failed:", error.message);
    return {
      delivered: false,
      error: error.message,
    };
  }
};

module.exports = {
  sendPasswordResetEmail,
  getTransporter,
};
