async function executeLogout() {
    const response = await fetch('../../auth/logout', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        }
    });
    if(response.ok) {
        window.location.href = "../";
    }
}