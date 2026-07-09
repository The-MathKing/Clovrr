export async function syncLeadToHubSpot(client: any, lead: any, status: string = 'NEW') {
  if (!client.hubspot_access_token) return;
  
  try {
    const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${client.hubspot_access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          firstname: lead.name ? lead.name.split(' ')[0] : 'Unknown',
          lastname: lead.name && lead.name.includes(' ') ? lead.name.split(' ').slice(1).join(' ') : undefined,
          email: lead.email || undefined,
          phone: lead.channel === 'sms' ? lead.contact_id : undefined,
          hs_lead_status: status // 'NEW', 'OPEN', 'IN_PROGRESS', 'OPEN_DEAL', etc.
        }
      })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      // HubSpot returns 409 Conflict if contact exists. For MVP, we catch it but ignore full upsert.
      console.error('Failed to sync to HubSpot (could be 409 duplicate):', errorText);
    }
  } catch (err) {
    console.error('HubSpot Sync Error:', err);
  }
}
