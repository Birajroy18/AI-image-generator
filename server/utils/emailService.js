import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

console.log("SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY ? "Set ✓" : "NOT SET ✗");

// Send OTP email using SendGrid
export const sendOTPEmail = async (email, otp) => {
  try {
    console.log("Attempting to send OTP email to:", email);
    
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@aimagegenerator.com",
      subject: "Your Verification Code",
      html: `
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
      `,
    };

    console.log("Sending OTP via SendGrid to:", email);
    const result = await sgMail.send(msg);
    console.log("OTP email sent successfully via SendGrid");
    return true;
  } catch (error) {
    console.error("Error sending OTP email via SendGrid:", error.message);
    if (error.response) {
      console.error("SendGrid error details:", error.response.body);
    }
    return false;
  }
};

// Send password reset email using SendGrid
export const sendPasswordResetEmail = async (email, otp) => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@aimagegenerator.com",
      subject: "Password Reset Code",
      html: `
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
      `,
    };

    console.log("Sending password reset via SendGrid to:", email);
    const result = await sgMail.send(msg);
    console.log("Password reset email sent successfully via SendGrid");
    return true;
  } catch (error) {
    console.error("Error sending password reset email via SendGrid:", error.message);
    if (error.response) {
      console.error("SendGrid error details:", error.response.body);
    }
    return false;
  }
};
