export async function verifyAccount(id: string, token: string) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/users/verify-account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      token,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return await res.json();
}
