export async function registerAccount(data: {
	accountName: string;
	userFirstName: string;
	userLastName: string;
	email: string;
	userJobTitle: string;
	password: string;
}) {
	const res = await fetch(
		`${import.meta.env.VITE_API_BASE}/users/register`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				...data,
				country: "US",
				companySize: "0-10",
				serviceType: "Provider",
				numberSites: "1"
			})
		}
	);
	if (!res.ok) throw new Error("register failed");
	return res.json();
}

