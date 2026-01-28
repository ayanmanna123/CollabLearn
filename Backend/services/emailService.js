import nodemailer from 'nodemailer';

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error('Missing SMTP configuration (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = getTransporter();
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  if (!from) {
    throw new Error('Missing EMAIL_FROM (or SMTP_USER)');
  }

  return transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  });
};

export const sendWelcomeEmail = async (email, name, role, dashboardLink) => {
  const safeName = name || 'there';
  const isMentor = role === 'mentor';

  const subject = isMentor
    ? 'Welcome to Ment2Be - Mentor Dashboard Access'
    : 'Welcome to Ment2Be - Student Dashboard Access';

  const headline = isMentor ? 'Welcome, Mentor!' : 'Welcome, Student!';
  const intro = isMentor
    ? 'Thanks for joining Ment2Be as a mentor. Your dashboard is ready—complete your profile and start connecting with students.'
    : 'Thanks for joining Ment2Be as a student. Your dashboard is ready—start exploring mentors and book your first session.';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">${headline}</h2>
      <p>Hi ${safeName},</p>
      <p>${intro}</p>
      <div style="margin: 30px 0;">
        <a href="${dashboardLink}" style="background-color: #4b5563; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Go to Dashboard
        </a>
      </div>
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #666;">${dashboardLink}</p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        If you didn’t create this account, please ignore this email.
      </p>
    </div>
  `;

  const text = `
    ${headline}

    Hi ${safeName},

    ${intro}

    Dashboard link:
    ${dashboardLink}

    If you didn’t create this account, please ignore this email.
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html
  });
};

export const sendPasswordResetEmail = async (email, resetToken, resetLink) => {
  const subject = 'Password Reset Request - Ment2Be';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>You requested a password reset for your Ment2Be account.</p>
      <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
      <div style="margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #666;">${resetLink}</p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        If you didn't request this, please ignore this email. Your password will remain unchanged.
      </p>
    </div>
  `;

  const text = `
    Password Reset Request
    
    You requested a password reset for your Ment2Be account.
    
    Click the link below to reset your password. This link will expire in 1 hour.
    
    ${resetLink}
    
    If you didn't request this, please ignore this email.
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html
  });
};
