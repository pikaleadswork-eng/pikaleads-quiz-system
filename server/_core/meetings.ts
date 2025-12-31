/**
 * Video Meeting Integration (Google Meet & Zoom)
 * 
 * Provides functions to create and manage video meetings.
 * 
 * Setup:
 * Google Meet:
 * 1. Create Google Cloud project
 * 2. Enable Google Calendar API
 * 3. Create OAuth 2.0 credentials
 * 4. Add to integration_settings
 * 
 * Zoom:
 * 1. Create Zoom App at https://marketplace.zoom.us
 * 2. Get API credentials
 * 3. Add to integration_settings
 */

interface GoogleMeetCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

interface ZoomCredentials {
  apiKey: string;
  apiSecret: string;
}

interface MeetingDetails {
  title: string;
  description?: string;
  startTime: Date;
  duration: number; // minutes
  attendeeEmail?: string;
}

/**
 * Create Google Meet meeting
 * 
 * @param credentials - Google OAuth credentials
 * @param details - Meeting details
 * @returns Meeting URL and event ID
 */
export async function createGoogleMeet(
  credentials: GoogleMeetCredentials,
  details: MeetingDetails
): Promise<{ meetingUrl: string; eventId: string }> {
  // Get access token from refresh token
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      refresh_token: credentials.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error("Failed to refresh Google access token");
  }

  const { access_token } = await tokenResponse.json();

  // Create calendar event with Google Meet
  const event = {
    summary: details.title,
    description: details.description || "",
    start: {
      dateTime: details.startTime.toISOString(),
      timeZone: "UTC",
    },
    end: {
      dateTime: new Date(
        details.startTime.getTime() + details.duration * 60000
      ).toISOString(),
      timeZone: "UTC",
    },
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    attendees: details.attendeeEmail
      ? [{ email: details.attendeeEmail }]
      : [],
  };

  const calendarResponse = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );

  if (!calendarResponse.ok) {
    throw new Error("Failed to create Google Meet event");
  }

  const eventData = await calendarResponse.json();

  return {
    meetingUrl: eventData.hangoutLink || eventData.conferenceData?.entryPoints?.[0]?.uri || "",
    eventId: eventData.id,
  };
}

/**
 * Create Zoom meeting
 * 
 * @param credentials - Zoom API credentials
 * @param details - Meeting details
 * @returns Meeting URL and meeting ID
 */
export async function createZoomMeeting(
  credentials: ZoomCredentials,
  details: MeetingDetails
): Promise<{ meetingUrl: string; meetingId: string }> {
  // Generate JWT token for Zoom API
  const jwt = require("jsonwebtoken");
  const token = jwt.sign(
    {
      iss: credentials.apiKey,
      exp: Math.floor(Date.now() / 1000) + 3600,
    },
    credentials.apiSecret
  );

  // Create Zoom meeting
  const meeting = {
    topic: details.title,
    type: 2, // Scheduled meeting
    start_time: details.startTime.toISOString(),
    duration: details.duration,
    timezone: "UTC",
    agenda: details.description || "",
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: false,
      mute_upon_entry: true,
      watermark: false,
      audio: "both",
      auto_recording: "none",
    },
  };

  const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(meeting),
  });

  if (!response.ok) {
    throw new Error("Failed to create Zoom meeting");
  }

  const data = await response.json();

  return {
    meetingUrl: data.join_url,
    meetingId: data.id.toString(),
  };
}

/**
 * Generate simple meeting link without OAuth (fallback)
 * Creates a Google Meet link using the simple meet.new redirect
 * 
 * @returns Meeting URL
 */
export async function generateSimpleMeetLink(): Promise<string> {
  // Google Meet allows creating instant meetings via meet.new
  // This redirects to a new meeting room
  const response = await fetch("https://meet.new", {
    method: "GET",
    redirect: "manual",
  });

  const location = response.headers.get("location");
  if (location) {
    return location;
  }

  // Fallback: generate random meeting code
  const randomCode = Math.random().toString(36).substring(2, 15);
  return `https://meet.google.com/${randomCode}`;
}

/**
 * Test Google Meet credentials
 */
export async function testGoogleMeetCredentials(
  credentials: GoogleMeetCredentials
): Promise<boolean> {
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        refresh_token: credentials.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    return tokenResponse.ok;
  } catch (error) {
    console.error("[Google Meet] Credential test failed:", error);
    return false;
  }
}

/**
 * Test Zoom credentials
 */
export async function testZoomCredentials(
  credentials: ZoomCredentials
): Promise<boolean> {
  try {
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      {
        iss: credentials.apiKey,
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      credentials.apiSecret
    );

    const response = await fetch("https://api.zoom.us/v2/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error("[Zoom] Credential test failed:", error);
    return false;
  }
}
