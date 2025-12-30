/**
 * Facebook Custom Audiences Integration
 * Export low-quality leads for retargeting
 */

/**
 * Export leads to Facebook Custom Audience
 */
export async function exportToFacebookAudience(params: {
  leads: Array<{ email?: string; phone?: string; name?: string }>;
  audienceName: string;
}): Promise<{ success: boolean; audienceId?: string; error?: string }> {
  const { leads, audienceName } = params;
  
  const fbAccessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const fbAdAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID;
  
  if (!fbAccessToken || !fbAdAccountId) {
    console.warn("[Facebook] Missing credentials (FACEBOOK_ACCESS_TOKEN or FACEBOOK_AD_ACCOUNT_ID)");
    return { success: false, error: "Facebook credentials not configured" };
  }
  
  try {
    // Step 1: Create or get Custom Audience
    const audienceResponse = await fetch(
      `https://graph.facebook.com/v18.0/act_${fbAdAccountId}/customaudiences`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: fbAccessToken,
          name: audienceName,
          subtype: "CUSTOM",
          description: "Low-quality leads for retargeting",
          customer_file_source: "USER_PROVIDED_ONLY",
        }),
      }
    );
    
    if (!audienceResponse.ok) {
      const error = await audienceResponse.text();
      console.error("[Facebook] Create audience failed:", error);
      return { success: false, error: `Facebook API error: ${audienceResponse.status}` };
    }
    
    const audienceData = await audienceResponse.json();
    const audienceId = audienceData.id;
    
    // Step 2: Hash user data (Facebook requires SHA-256 hashing)
    const crypto = await import("crypto");
    const hashedLeads = leads.map(lead => {
      const data: any = {};
      
      if (lead.email) {
        data.em = crypto.createHash("sha256").update(lead.email.toLowerCase().trim()).digest("hex");
      }
      if (lead.phone) {
        // Remove all non-digits and add country code if missing
        const cleanPhone = lead.phone.replace(/\D/g, "");
        data.ph = crypto.createHash("sha256").update(cleanPhone).digest("hex");
      }
      if (lead.name) {
        const [firstName, ...lastNameParts] = lead.name.split(" ");
        if (firstName) {
          data.fn = crypto.createHash("sha256").update(firstName.toLowerCase().trim()).digest("hex");
        }
        if (lastNameParts.length > 0) {
          data.ln = crypto.createHash("sha256").update(lastNameParts.join(" ").toLowerCase().trim()).digest("hex");
        }
      }
      
      return data;
    });
    
    // Step 3: Upload users to Custom Audience
    const uploadResponse = await fetch(
      `https://graph.facebook.com/v18.0/${audienceId}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: fbAccessToken,
          payload: {
            schema: ["EMAIL", "PHONE", "FN", "LN"],
            data: hashedLeads,
          },
        }),
      }
    );
    
    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error("[Facebook] Upload users failed:", error);
      return { success: false, error: `Facebook API error: ${uploadResponse.status}` };
    }
    
    const uploadData = await uploadResponse.json();
    console.log("[Facebook] Users uploaded successfully:", uploadData);
    
    return {
      success: true,
      audienceId,
    };
  } catch (error) {
    console.error("[Facebook] Export error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get low-quality leads for retargeting (score < 40)
 */
export async function getLowQualityLeads() {
  const { getAllLeads } = await import("./db");
  const allLeads = await getAllLeads();
  
  return allLeads.filter(lead => {
    const score = lead.leadScore || 0;
    return score < 40 && (lead.email || lead.phone);
  });
}
