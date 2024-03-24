export async function login(body) {
  const response = await fetch(process.env.REACT_APP_API_URL + `/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });

  const parsedResponse = await response.json();

  if ([401, 404].includes(response.status)) {
    throw new Error(parsedResponse.message);
  } else if (!response.ok) {
    throw new Error("Unknown error, please try again!");
  }

  return parsedResponse;
}
