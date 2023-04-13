export const fetcher = async ({ url, method, body, json = true }) => {
  const res = await fetch(url, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    // handle errors
    console.log(res);
    throw new Error("API error");
  }
  if (json) {
    const data = await res.json();
    return data.data;
  }
};

export const register = (user) => {
  return fetcher({ url: "/api/register", method: "post", body: user });
};

export const signin = (user) => {
  return fetcher({ url: "/api/signin", method: "post", body: user });
};

export const createNewProject = async (name) => {
  return fetcher({
    url: "/api/project",
    method: "POST",
    body: { name },
    json: true,
  });
};
