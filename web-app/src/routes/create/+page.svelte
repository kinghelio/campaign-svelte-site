<script>
    let name = '';
    let isLoading = false;
    let result = null;

    async function createProfile() {
        isLoading = true;
        result = null;

        const response = await fetch('/api/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });

        result = await response.json();
        isLoading = false;
    }
</script>

<main class="container">
    <h1>Create a New Profile</h1>

    {#if result && result.accessCode}
        <div class="card success">
            <h2>Profile Created!</h2>
            <p>Your unique access code is:</p>
            <strong class="code">{result.accessCode}</strong>
            <p>Save this code! You will need it to access your profile later.</p>
            <a href={`/profile/${result.accessCode}`}>View Your Profile</a>
        </div>
    {:else}
        <form on:submit|preventDefault={createProfile} class="card">
            <label>Name:<input type="text" bind:value={name} required /></label>

            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Profile'}
            </button>
        </form>
    {/if}

    {#if result && result.error}
        <p class="error">{result.error}</p>
    {/if}
</main>

<style>
    /* Add specific styles for this page */
    .container { max-width: 600px; margin: 50px auto; padding: 20px; font-family: sans-serif; }
    .card { background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-top: 20px; }
    label, input{ display: block; width: 100%; margin-bottom: 10px; box-sizing: border-box; }
    input{ padding: 10px; border-radius: 4px; border: 1px solid #ccc; }
    button { padding: 10px 20px; border: none; background-color: #28a745; color: white; border-radius: 4px; cursor: pointer; }
    button:hover { background-color: #218838; }
    .success { text-align: center; border-color: #28a745; }
    .code { font-size: 2em; color: #007bff; display: block; margin: 10px 0; }
    .error { color: red; }
</style>