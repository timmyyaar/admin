export async function getOrders() {
  const response = await fetch(process.env.REACT_APP_API_URL + "/api/order", {
    credentials: "include",
  });
  const data = await response.json();
  return data;
}

export async function deleteOrder(param) {
  const response = await fetch(process.env.REACT_APP_API_URL + "/api/order", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(param),
    credentials: "include",
  });
  const data = await response.json();
  return data;
}

export async function assignOrder(id, cleanerId) {
  const response = await fetch(
    process.env.REACT_APP_API_URL + `/api/order/${id}/${cleanerId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  const parsedResponse = await response.json();

  if ([422].includes(response.status)) {
    throw new Error(parsedResponse.message);
  } else if (!response.ok) {
    throw new Error("Unknown error, please try again!");
  }

  return parsedResponse;
}

export async function changeOrderStatus(id, status) {
  const response = await fetch(
    process.env.REACT_APP_API_URL + `/api/order/${id}/update-status/${status}`,
    {
      method: "PATCH",
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

export const fetchUsers = async () => {
  const response = await fetch(process.env.REACT_APP_API_URL + `/api/users`, {
    credentials: "include",
  });

  const parsedResponse = await response.json();

  if (!response.ok) {
    throw new Error("No access!");
  }

  return parsedResponse;
};
