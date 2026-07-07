import nodemailer from "nodemailer";

const authUser = process.env.SMTP_USER?.trim() || process.env.EMAIL_USER?.trim();
const authPass = process.env.SMTP_PASS?.trim() || process.env.EMAIL_PASS?.trim();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST?.trim() || "smtp.hostinger.com",
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: process.env.SMTP_SECURE !== undefined
    ? process.env.SMTP_SECURE.trim() === "true"
    : true,
  auth: {
    user: authUser,
    pass: authPass,
  },
});

export async function sendOrderEmails({
  customerEmail,
  adminEmail,
  subject,
  customerHtml,
  adminHtml,
}: {
  customerEmail: string;
  adminEmail: string;
  subject: string;
  customerHtml: string;
  adminHtml: string;
}) {
  const from =
    process.env.SMTP_FROM?.trim() || authUser || "no-reply@ifilifestyle.com";
  await Promise.all([
    transporter.sendMail({
      from,
      to: customerEmail,
      subject,
      html: customerHtml,
    }),
    transporter.sendMail({
      from,
      to: adminEmail,
      subject: `New Order Received - ${subject}`,
      html: adminHtml,
    }),
  ]);
}

/** True when Nodemailer can authenticate (SMTP_* or EMAIL_USER + EMAIL_PASS). */
export function smtpCredentialsReady(): boolean {
  return Boolean(authUser && authPass);
}

/** Inbox for order notifications and default contact inbox. Set `RECIPIENT_EMAIL` in `.env.local`. */
export function getRecipientInboxEmail(): string | undefined {
  return process.env.RECIPIENT_EMAIL?.trim() || undefined;
}

/** Contact form “to” address: optional separate inbox, otherwise same as `getRecipientInboxEmail()`. */
export function getContactNotifyEmail(): string | undefined {
  return process.env.CONTACT_NOTIFY_EMAIL?.trim() || getRecipientInboxEmail();
}

export async function sendSellerOrderNotification({
  sellerEmail,
  subject,
  html,
}: {
  sellerEmail: string;
  subject: string;
  html: string;
}) {
  const from =
    process.env.SMTP_FROM?.trim() || authUser || "no-reply@ifilifestyle.com";
  await transporter.sendMail({ from, to: sellerEmail, subject, html });
}

export async function sendContactNotification(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const from =
    process.env.SMTP_FROM?.trim() || authUser || "no-reply@ifilifestyle.com";
  await transporter.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo || undefined,
  });
}
