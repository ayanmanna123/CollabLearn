import { z } from 'zod';
import { sendEmail } from '../services/emailService.js';

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  subject: z.string().min(1).max(150),
  message: z.string().min(1).max(5000)
});

export const submitContactForm = async (req, res) => {
  try {
    const parsed = contactSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid form data',
        errors: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }))
      });
    }

    const { name, email, subject, message } = parsed.data;

    const to = 'arshchouhan004@gmail.com';

    const mailSubject = `[Ment2Be Contact] ${subject}`;

    const text = [
      'New Contact Us submission:',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      '',
      'Message:',
      message
    ].join('\n');

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6">
        <h2 style="margin:0 0 12px 0">New Contact Us Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    `;

    await sendEmail({
      to,
      subject: mailSubject,
      text,
      html
    });

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

const escapeHtml = (value) => {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
};
