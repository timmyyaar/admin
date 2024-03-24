export async function getLocales() {
  const response = await fetch(process.env.REACT_APP_API_URL + '/api/locales');
  const data = await response.json();
  return data.locales;
}

export async function addLocale(localeObj) {
  const response = await fetch(process.env.REACT_APP_API_URL + '/api/locales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(localeObj),
    credentials: "include",
  });

  const data = await response.json();
  return data.locale;
}

export async function updateLocale(localeObj) {
  const response = await fetch(process.env.REACT_APP_API_URL + '/api/locales', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(localeObj),
    credentials: "include",
  });

  const data = await response.json();
  return data.locale;
}

export async function deleteLocale(localeObj) {
  const response = await fetch(process.env.REACT_APP_API_URL + '/api/locales', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(localeObj),
    credentials: "include",
  });

  const data = await response.json();
  return data.locale;
}
