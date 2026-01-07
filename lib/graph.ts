export type GraphListItem = {
  id: string;
  fields: Record<string, any>;
  [key: string]: any;
};

async function fetchJson(url: string, opts: RequestInit = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  try {
    return res.ok ? JSON.parse(text || '{}') : Promise.reject(new Error(text || res.statusText));
  } catch (err) {
    if (!res.ok) throw new Error(text || res.statusText);
    return {};
  }
}

export async function getAccessToken(): Promise<string> {
  const tenant = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;
  if (!tenant || !clientId || !clientSecret) {
    throw new Error('Azure AD credentials not set in environment variables');
  }

  const url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials',
  });

  const json = await fetchJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!json.access_token) throw new Error('Failed to obtain access token');
  return json.access_token as string;
}

export async function createListItem(fields: Record<string, any>) {
  const siteId = process.env.SHAREPOINT_SITE_ID;
  const listId = process.env.SHAREPOINT_LIST_ID;
  if (!siteId || !listId) throw new Error('SharePoint site/list IDs not set');

  const token = await getAccessToken();
  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`;
  const body = { fields };

  return fetchJson(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function getListItemsExpandFields(): Promise<GraphListItem[]> {
  const siteId = process.env.SHAREPOINT_SITE_ID;
  const listId = process.env.SHAREPOINT_LIST_ID;
  if (!siteId || !listId) throw new Error('SharePoint site/list IDs not set');

  const token = await getAccessToken();
  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?expand=fields`;
  const json = await fetchJson(url, { headers: { Authorization: `Bearer ${token}` } });
  return (json.value || []) as GraphListItem[];
}

export async function findItemByField(fieldName: string, value: string) {
  const items = await getListItemsExpandFields();
  return items.find(i => i.fields && String(i.fields[fieldName]) === String(value)) || null;
}

export async function updateListItemFields(itemId: string, fields: Record<string, any>) {
  const siteId = process.env.SHAREPOINT_SITE_ID;
  const listId = process.env.SHAREPOINT_LIST_ID;
  if (!siteId || !listId) throw new Error('SharePoint site/list IDs not set');

  const token = await getAccessToken();
  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items/${itemId}/fields`;
  return fetchJson(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fields),
  });
}
