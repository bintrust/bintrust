const htmlTemplate = (option: {
  varificationCode: string;
  oi: string;
  firstName?: string;
}) => {
  return `
    <p>
        Dear, ${option.firstName || "user"}
    </p>
    <p>
        We've detected an attempt to access your account from a different IP address. To ensure the security of your account, we're reaching out to you for verification.
    </p>

    <p>
        If this was you, please use the following verification code to confirm your identity:
    </p>

    <p>
        Verification Code: ${option.varificationCode}
    </p>
    
    <p>
        <a href=${`${process.env.BASE_URL}/auth/verify?oi=${option.oi}`} 
        style="padding: 6px 12px; background: #22d3ee; border-radius: 6px; text-decoration:none; color: #525252;">
            Verify Identity
        </a>
    </p>

    <p>
        If you did not initiate this activity, please secure your account immediately by changing your password and enabling two-factor authentication (2FA) for added security. You can do this by visiting your account settings.
    </p>
  
    <p>
        Thank you for your attention to this matter. If you have any questions or concerns, please don't hesitate to contact our support team.
    </p>

    <p>
        Best regards,
        Abdulazeez
    </p>
`;
};

export default htmlTemplate;
