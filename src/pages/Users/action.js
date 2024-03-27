export async function fetchUsers() {
  const response = await fetch(process.env.REACT_APP_API_URL + `/api/users`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const parsedResponse = await response.json();

  if (!response.ok) {
    throw new Error("Unknown error, please try again!");
  }

  return parsedResponse;
}

export async function createUser(body) {
  const response = await fetch(process.env.REACT_APP_API_URL + `/api/users`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const parsedResponse = await response.json();

  if (response.status === 422) {
    throw new Error(parsedResponse.message);
  } else if (!response.ok) {
    throw new Error("Unknown error, please try again!");
  }

  return parsedResponse;
}

export async function updateUserRole(id, body) {
  const response = await fetch(
    process.env.REACT_APP_API_URL + `/api/users/${id}/update-role`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  const parsedResponse = await response.json();

  if (response.status === 422) {
    throw new Error(parsedResponse.message);
  } else if (!response.ok) {
    throw new Error("Unknown error, please try again!");
  }

  return parsedResponse;
}

export async function changeUserPassword(id, body) {
  const response = await fetch(
    process.env.REACT_APP_API_URL + `/api/users/${id}/change-password`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  const parsedResponse = await response.json();

  if (!response.ok) {
    throw new Error("Unknown error, please try again!");
  }

  return parsedResponse;
}

export async function deleteUser(id) {
  const response = await fetch(
    process.env.REACT_APP_API_URL + `/api/users/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const parsedResponse = await response.json();

  if (!response.ok) {
    throw new Error("Unknown error, please try again!");
  }

  return parsedResponse;
}
