export async function getCareers() {
  const response = await fetch(process.env.REACT_APP_API_URL + '/api/careers');
  const data = await response.json();
  return data;
}

export async function deleteCareers(param) {
  const response = await fetch(process.env.REACT_APP_API_URL + '/api/careers', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(param),
  });

  const data = await response.json();
  return data.locale;
}
