export async function getDashboardUser(discordId: string) {
    const response = await fetch(`${process.env.DASHBOARD_URL}/api/application/user/discord/${discordId}`, {
        headers: {
            "Authorization": `Bearer ${process.env.DASHBOARD_KEY}`,
            "Accept": "application/json"
        }
    });

    if(response.status !== 200) return;

    return response.json();
}