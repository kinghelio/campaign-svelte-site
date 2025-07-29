<script>
    import { goto } from '$app/navigation';
    let accessCode = '';
    let errorMessage = '';

    async function handleAccess() {
        if (!/^\d{6}$/.test(accessCode)) {
            errorMessage = 'Please enter a valid 6-digit code.';
            return;
        }
        goto(`/profile/${accessCode}`);
    }

    function handleCreate() {
        goto('/create');
    }
</script>

<main class="container">
    <h1>Profile Access</h1>
    <p>Create a new profile or enter your access code to view an existing one.</p>
    <div class="card">
        <h2>Access Your Profile</h2>
        <form on:submit|preventDefault={handleAccess}>
            <input type="text" bind:value={accessCode} placeholder="Enter 6-digit code" maxlength="6" />
            <button type="submit">View Profile</button>
        </form>
        {#if errorMessage}
            <p class="error">{errorMessage}</p>
        {/if}
    </div>
    <div class="card">
        <h2>New User?</h2>
        <button on:click={handleCreate}>Create New Profile</button>
    </div>
</main>
<style>
    .container { max-width: 800px; margin: 50px auto; padding: 20px; font-family: sans-serif; text-align: center; }
    .card { background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-top: 20px; text-align: left; }
    input { padding: 10px; width: calc(100% - 24px); margin-bottom: 10px; border-radius: 4px; border: 1px solid #ccc; }
    button { padding: 10px 20px; border: none; background-color: #007bff; color: white; border-radius: 4px; cursor: pointer; }
    button:hover { background-color: #0056b3; }
    .error { color: red; font-size: 0.9em; }
</style>