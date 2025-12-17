import { sendEmail } from "../email";
import { getDb } from "../db";
import { integrationSettings } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

interface AlertConfig {
  subject: string;
  body: string;
  severity: "critical" | "warning" | "info";
}

/**
 * Send email alert for critical server events
 * Duplicates Telegram notifications to email for redundancy
 */
export async function sendEmailAlert(config: AlertConfig): Promise<boolean> {
  try {
    // Get SMTP settings from database
    const db = await getDb();
    if (!db) {
      console.warn("[Email Alert] Database not available");
      return false;
    }
    
    const settings = await db
      .select()
      .from(integrationSettings)
      .where(eq(integrationSettings.provider, "email"))
      .limit(1);

    if (!settings || settings.length === 0) {
      console.warn("[Email Alert] SMTP not configured, skipping email alert");
      return false;
    }

    const smtpConfig = settings[0].credentials as any;
    
    if (!smtpConfig?.fromEmail) {
      console.warn("[Email Alert] From email not configured");
      return false;
    }

    // Determine recipient (use from email as default, or add admin email field)
    const recipientEmail = smtpConfig.adminEmail || smtpConfig.fromEmail;

    // Add severity emoji and color
    const severityEmoji = {
      critical: "🚨",
      warning: "⚠️",
      info: "ℹ️"
    };

    const emailSubject = `${severityEmoji[config.severity]} ${config.subject}`;
    
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .alert-box {
      border-left: 4px solid ${config.severity === "critical" ? "#dc2626" : config.severity === "warning" ? "#f59e0b" : "#3b82f6"};
      background-color: ${config.severity === "critical" ? "#fee2e2" : config.severity === "warning" ? "#fef3c7" : "#dbeafe"};
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .severity {
      font-weight: bold;
      color: ${config.severity === "critical" ? "#dc2626" : config.severity === "warning" ? "#f59e0b" : "#3b82f6"};
      text-transform: uppercase;
      font-size: 12px;
      margin-bottom: 10px;
    }
    .message {
      font-size: 16px;
      margin: 10px 0;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #3b82f6;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>PIKALEADS Server Alert</h2>
    
    <div class="alert-box">
      <div class="severity">${config.severity} Alert</div>
      <div class="message">${config.body}</div>
    </div>
    
    <p>Timestamp: ${new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kiev" })}</p>
    
    <a href="${process.env.VITE_APP_URL || "http://localhost:3000"}/admin/monitoring" class="button">
      View Server Monitoring Dashboard
    </a>
    
    <div class="footer">
      <p>This is an automated alert from PIKALEADS Lead Engine monitoring system.</p>
      <p>To configure alert settings, visit Admin Dashboard → Settings → Integration Settings.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Send email using existing SMTP configuration
    await sendEmail({
      to: recipientEmail,
      subject: emailSubject,
      html: emailBody,
    });

    console.log(`[Email Alert] Sent ${config.severity} alert: ${config.subject}`);
    return true;
  } catch (error) {
    console.error("[Email Alert] Failed to send email:", error);
    return false;
  }
}

/**
 * Send high memory usage alert
 */
export async function sendHighMemoryAlert(usagePercent: string, used: string, total: string) {
  return sendEmailAlert({
    subject: "High Memory Usage Detected",
    body: `
      <strong>Memory usage is critically high!</strong><br><br>
      Current usage: <strong>${usagePercent}</strong><br>
      Used: ${used} / ${total}<br><br>
      <strong>Recommended actions:</strong>
      <ul>
        <li>Restart the server to free up memory</li>
        <li>Check for memory leaks in application logs</li>
        <li>Consider upgrading server resources</li>
      </ul>
    `,
    severity: "critical"
  });
}

/**
 * Send high CPU load alert
 */
export async function sendHighCPUAlert(loadAverage: number, cores: number) {
  return sendEmailAlert({
    subject: "High CPU Load Detected",
    body: `
      <strong>CPU load is higher than normal!</strong><br><br>
      Current load: <strong>${loadAverage.toFixed(2)}</strong><br>
      CPU cores: ${cores}<br><br>
      <strong>Recommended actions:</strong>
      <ul>
        <li>Check for resource-intensive processes</li>
        <li>Review recent code deployments</li>
        <li>Monitor for DDoS attacks or traffic spikes</li>
      </ul>
    `,
    severity: "warning"
  });
}

/**
 * Send database connection failure alert
 */
export async function sendDatabaseDownAlert(responseTime: string) {
  return sendEmailAlert({
    subject: "Database Connection Failed",
    body: `
      <strong>Database is not responding!</strong><br><br>
      Last response time: ${responseTime}<br><br>
      <strong>Immediate actions required:</strong>
      <ul>
        <li>Check database server status</li>
        <li>Verify network connectivity</li>
        <li>Review database logs for errors</li>
        <li>Contact hosting provider if issue persists</li>
      </ul>
    `,
    severity: "critical"
  });
}

/**
 * Send high error rate alert
 */
export async function sendHighErrorRateAlert(errorCount: number, timeWindow: string) {
  return sendEmailAlert({
    subject: "High Error Rate Detected",
    body: `
      <strong>Application is experiencing elevated error rates!</strong><br><br>
      Errors in last ${timeWindow}: <strong>${errorCount}</strong><br><br>
      <strong>Recommended actions:</strong>
      <ul>
        <li>Check error logs for patterns</li>
        <li>Review recent deployments</li>
        <li>Monitor third-party service status</li>
        <li>Check for API rate limits</li>
      </ul>
    `,
    severity: "warning"
  });
}
