import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  return resend.emails.send({
    from: "Flight Deal Tracker <deals@resend.dev>",
    to,
    subject,
    html,
  });
}
