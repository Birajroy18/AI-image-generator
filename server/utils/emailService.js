import SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY ? "Set ✓" : "NOT SET ✗");

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Send OTP email using Brevo
export const sendOTPEmail = async (email, otp) => {
  try {
    console.log("Attempting to send OTP email to:", email);

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { email: process.env.BREVO_FROM_EMAIL, name: "AI Image Generator" };
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = "Your Verification Code";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Email Verification</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h3 style="color: #007bff; font-size: 24px; margin: 0;">${otp}</h3>
          <p style="color: #666; margin: 10px 0 0 0;">Your verification code</p>
        </div>
        <p style="color: #666; line-height: 1.6;">
          This code will expire in 10 minutes. Please use it to complete your verification.
        </p>
        <p style="color: #999; font-size: 12px;">
          If you didn't request this code, please ignore this email.
        </p>
      </div>
    `;

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("OTP email sent successfully via Brevo", result);
    return true;
  } catch (error) {
    console.error("Error sending OTP email via Brevo:", error.message);
    return false;
  }
};

// Send password reset email using Brevo
export const sendPasswordResetEmail = async (email, otp) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { email: process.env.BREVO_FROM_EMAIL, name: "AI Image Generator" };
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = "Password Reset Code";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Password Reset</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h3 style="color: #dc3545; font-size: 24px; margin: 0;">${otp}</h3>
          <p style="color: #666; margin: 10px 0 0 0;">Your password reset code</p>
        </div>
        <p style="color: #666; line-height: 1.6;">
          Use this code to reset your password. This code will expire in 10 minutes.
        </p>
        <p style="color: #999; font-size: 12px;">
          If you didn't request a password reset, please ignore this email.
        </p>
      </div>
    `;

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Password reset email sent successfully via Brevo", result);
    return true;
  } catch (error) {
    console.error("Error sending password reset email via Brevo:", error.message);
    return false;
  }
};