import twilio from 'twilio';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';

let twilioClient: ReturnType<typeof twilio> | null = null;

function getTwilioClient() {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.warn('[SMS] Twilio credentials not configured');
    return null;
  }

  if (!twilioClient) {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }

  return twilioClient;
}

export interface SMSOptions {
  to: string;
  message: string;
}

/**
 * Send SMS via Twilio
 */
export async function sendSMS({ to, message }: SMSOptions): Promise<boolean> {
  const client = getTwilioClient();

  if (!client) {
    console.error('[SMS] Twilio client not initialized');
    return false;
  }

  if (!TWILIO_PHONE_NUMBER) {
    console.error('[SMS] TWILIO_PHONE_NUMBER not configured');
    return false;
  }

  try {
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = to.replace(/[^\d+]/g, '');

    // Ensure phone number starts with +
    const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;

    const result = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log(`[SMS] Message sent successfully: ${result.sid}`);
    return true;
  } catch (error) {
    console.error('[SMS] Failed to send message:', error);
    return false;
  }
}

/**
 * Send SMS notification when lead status changes
 */
export async function sendLeadStatusSMS(phone: string, leadName: string, status: string): Promise<boolean> {
  const message = `Вітаємо, ${leadName}! Статус вашої заявки змінено на: ${status}. Дякуємо за звернення до PIKALEADS!`;
  return sendSMS({ to: phone, message });
}

/**
 * Send SMS appointment reminder
 */
export async function sendAppointmentReminderSMS(
  phone: string,
  leadName: string,
  appointmentTime: string
): Promise<boolean> {
  const message = `Нагадування: ${leadName}, ваша зустріч заплановано на ${appointmentTime}. PIKALEADS чекає на вас!`;
  return sendSMS({ to: phone, message });
}

/**
 * Send SMS when lead is created
 */
export async function sendLeadConfirmationSMS(phone: string, leadName: string): Promise<boolean> {
  const message = `Дякуємо, ${leadName}! Ваша заявка прийнята. Наш менеджер зв'яжеться з вами найближчим часом. PIKALEADS`;
  return sendSMS({ to: phone, message });
}
