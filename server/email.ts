import sgMail from "@sendgrid/mail";

/**
 * Email service using SendGrid
 * Requires SENDGRID_API_KEY environment variable
 */

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Initialize SendGrid with API key
 */
function initializeSendGrid(): boolean {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    console.warn("[Email] SendGrid API key not configured");
    return false;
  }
  
  try {
    sgMail.setApiKey(apiKey);
    return true;
  } catch (error) {
    console.error("[Email] Failed to initialize SendGrid:", error);
    return false;
  }
}

/**
 * Send email via SendGrid
 */
export async function sendEmail(params: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  if (!initializeSendGrid()) {
    return {
      success: false,
      error: "SendGrid not configured. Please set SENDGRID_API_KEY environment variable.",
    };
  }
  
  const fromEmail = params.from || process.env.SENDGRID_FROM_EMAIL || "noreply@pika-leads.com";
  
  try {
    await sgMail.send({
      to: params.to,
      from: fromEmail,
      subject: params.subject,
      html: params.html,
    });
    
    console.log(`[Email] Successfully sent to ${params.to}`);
    return { success: true };
  } catch (error: any) {
    console.error("[Email] Failed to send:", error.response?.body || error.message);
    return {
      success: false,
      error: error.response?.body?.errors?.[0]?.message || error.message,
    };
  }
}

/**
 * Generate HTML template for manager invitation email
 */
export function generateManagerInvitationEmail(params: {
  email: string;
  invitationUrl: string;
  invitedBy: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background-color: #000000;
      color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #111111;
      border: 2px solid #5B2E90;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #5B2E90 0%, #7B3EB0 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      color: #FFD93D;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #FFD93D;
      font-size: 24px;
      margin-top: 0;
    }
    .content p {
      line-height: 1.6;
      color: #cccccc;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #5B2E90 0%, #7B3EB0 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 16px 40px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 18px;
      margin: 20px 0;
      box-shadow: 0 4px 12px rgba(91, 46, 144, 0.4);
    }
    .button:hover {
      background: linear-gradient(135deg, #7B3EB0 0%, #9B4ED0 100%);
    }
    .info-box {
      background-color: #1a1a1a;
      border-left: 4px solid #FFD93D;
      padding: 15px;
      margin: 20px 0;
    }
    .footer {
      background-color: #0a0a0a;
      padding: 20px;
      text-align: center;
      color: #888888;
      font-size: 14px;
    }
    .footer a {
      color: #5B2E90;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">⚡</div>
      <h1>PIKALEADS</h1>
    </div>
    
    <div class="content">
      <h2>🎯 Запрошення до команди</h2>
      
      <p>Вітаємо!</p>
      
      <p><strong>${params.invitedBy}</strong> запросив вас приєднатися до PIKALEADS як менеджер.</p>
      
      <div class="info-box">
        <p style="margin: 0;"><strong>📧 Email:</strong> ${params.email}</p>
      </div>
      
      <p>Як менеджер, ви матимете доступ до:</p>
      <ul style="color: #cccccc; line-height: 1.8;">
        <li>CRM системи для управління лідами</li>
        <li>Інструментів для комунікації з клієнтами через Telegram та Instagram</li>
        <li>Статистики та аналітики по вашим лідам</li>
        <li>Системи коментарів та статусів</li>
      </ul>
      
      <p>Натисніть кнопку нижче, щоб завершити реєстрацію:</p>
      
      <center>
        <a href="${params.invitationUrl}" class="button">
          Прийняти запрошення →
        </a>
      </center>
      
      <p style="font-size: 14px; color: #888888; margin-top: 30px;">
        ⏰ Це запрошення дійсне протягом 7 днів.
      </p>
      
      <p style="font-size: 14px; color: #888888;">
        Якщо ви не очікували цього запрошення, просто проігноруйте цей лист.
      </p>
    </div>
    
    <div class="footer">
      <p>
        © 2025 PIKALEADS Lead Engine<br>
        <a href="mailto:info@pika-leads.com">info@pika-leads.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Send manager invitation email
 */
export async function sendManagerInvitation(params: {
  email: string;
  invitationUrl: string;
  invitedBy: string;
}): Promise<{ success: boolean; error?: string }> {
  const html = generateManagerInvitationEmail(params);
  
  return await sendEmail({
    to: params.email,
    subject: "🎯 Запрошення до PIKALEADS - Manager Access",
    html,
  });
}
