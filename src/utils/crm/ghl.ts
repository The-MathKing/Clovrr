export async function syncLeadToGHL(client: any, lead: any, tags: string[] = []) {
  if (!client.ghl_api_key || !client.ghl_location_id) return;
  
  try {
    // GoHighLevel v1 API example (simplest for API Keys instead of OAuth)
    const res = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${client.ghl_api_key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        locationId: client.ghl_location_id,
        name: lead.name || 'Unknown Lead',
        email: lead.email || undefined,
        phone: lead.channel === 'sms' ? lead.contact_id : undefined,
        tags: tags
      })
    });
    if (!res.ok) {
      console.error('Failed to sync to GHL:', await res.text());
    }
  } catch (err) {
    console.error('GHL Sync Error:', err);
  }
}
