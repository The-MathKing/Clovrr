import { syncLeadToGHL } from './ghl';
import { syncLeadToHubSpot } from './hubspot';

export async function syncLeadToCRMs(client: any, lead: any, isBooked: boolean = false) {
  const ghlTags = isBooked ? ['Booked via Clovrr'] : ['New Lead (Clovrr)'];
  const hsStatus = isBooked ? 'CONNECTED' : 'NEW';
  
  await Promise.allSettled([
    syncLeadToGHL(client, lead, ghlTags),
    syncLeadToHubSpot(client, lead, hsStatus)
  ]);
}
