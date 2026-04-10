import nodemailer from 'nodemailer';

const getTransporter = () => {
  // Try to use EMAIL_USER/EMAIL_PASS from .env
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  // Also keep support for SMTP_* variables if present
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // Case 1: Use EMAIL_USER/PASS with Gmail service (most likely case for this project)
  if (emailUser && emailPass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });
  }

  // Case 2: Use specific SMTP configuration
  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });
  }

  throw new Error('Missing email configuration. Please set EMAIL_USER/EMAIL_PASS or SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS in .env');
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = getTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || process.env.SMTP_USER;

  if (!from) {
    throw new Error('Missing EMAIL_FROM (or EMAIL_USER/SMTP_USER)');
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
    ? 'Welcome to CollabLearn - Mentor Dashboard Access'
    : 'Welcome to CollabLearn - Student Dashboard Access';

  const headline = isMentor ? 'Welcome, Mentor!' : 'Welcome, Student!';
  const intro = isMentor
    ? 'Thanks for joining CollabLearn as a mentor. Your dashboard is ready—complete your profile and start connecting with students.'
    : 'Thanks for joining CollabLearn as a student. Your dashboard is ready—start exploring mentors and book your first session.';

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
  const subject = 'Password Reset Request - CollabLearn';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>You requested a password reset for your CollabLearn account.</p>
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
    
    You requested a password reset for your CollabLearn account.
    
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

export const sendBookingConfirmationEmail = async (email, studentName, mentorName, sessionTitle, sessionDate, sessionTime) => {
  const subject = `Booking Confirmed: ${sessionTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Booking Confirmed!</h2>
      <p>Hi ${studentName},</p>
      <p>Your session "<strong>${sessionTitle}</strong>" with ${mentorName} has been confirmed.</p>
      <p><strong>Date:</strong> ${new Date(sessionDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
      <p><strong>Time:</strong> ${sessionTime}</p>
      <div style="margin: 30px 0;">
        <p>Please log in to your CollabLearn dashboard to join the session at the scheduled time.</p>
      </div>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        CollabLearn Team
      </p>
    </div>
  `;

  const text = `
    Booking Confirmed!
    
    Hi ${studentName},
    
    Your session "${sessionTitle}" with ${mentorName} has been confirmed.
    
    Date: ${new Date(sessionDate).toLocaleDateString('en-US')}
    Time: ${sessionTime}
    
    Please log in to your CollabLearn dashboard to join the session at the scheduled time.
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html
  });
};

export const sendBookingCancellationEmail = async (email, recipientName, sessionTitle, cancelledByName, reason) => {
  const subject = `Booking Cancelled: ${sessionTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Booking Cancelled</h2>
      <p>Hi ${recipientName},</p>
      <p>Your session "<strong>${sessionTitle}</strong>" has been cancelled by ${cancelledByName}.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <div style="margin: 30px 0;">
        <p>Please log in to your CollabLearn dashboard to view details or book another session.</p>
      </div>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        CollabLearn Team
      </p>
    </div>
  `;

  const text = `
    Booking Cancelled
    
    Hi ${recipientName},
    
    Your session "${sessionTitle}" has been cancelled by ${cancelledByName}.
    ${reason ? `Reason: ${reason}` : ''}
    
    Please log in to your CollabLearn dashboard to view details.
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html
  });
};
