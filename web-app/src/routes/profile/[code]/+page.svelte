<script lang="ts">
    import { page } from '$app/state';
    import { onMount } from 'svelte';

    export let data;

    // --- State for Profile Data ---
    let experienceText = '';
    let saveStatus: 'idle' | 'saving' | 'saved' | 'error' = 'idle';
    let debounceTimer: NodeJS.Timeout;

    // Initialize local state when component mounts
    onMount(() => {
        experienceText = data.profile?.experienceText || '';
        saveStatus = 'saved';
    });

    /**
     * Debounces the save operation to avoid excessive API calls.
     */
    function triggerSave() {
        saveStatus = 'saving';
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            saveProfile();
        }, 1500); // Wait 1.5 seconds after user stops typing
    }

    /**
     * Saves the experience text to the backend.
     */
    async function saveProfile() {
        const apiUrl = `/api/update-profile/${page.params.code}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ experienceText: experienceText })
        });

        if (response.ok) {
            saveStatus = 'saved';
        } else {
            saveStatus = 'error';
        }
    }
</script>

<main class="container">
    {#if data.profile}
        <h1>Profile: {data.profile.name}</h1>

        <div class="card">
            <div class="header">
                <h2>Experience Notes</h2>
                <div class="status {saveStatus}">
                    {#if saveStatus === 'idle'}Idle...{/if}
                    {#if saveStatus === 'saving'}Saving...{/if}
                    {#if saveStatus === 'saved'}✓ All changes saved{/if}
                    {#if saveStatus === 'error'}✗ Error saving{/if}
                </div>
            </div>

            <textarea
                class="experience-box"
                placeholder="Enter your experience notes here..."
                bind:value={experienceText}
                on:input={triggerSave}
            ></textarea>

        </div>

    {:else if data.error}
        <div class="card error">
            <h2>Error</h2>
            <p>{data.error}</p>
        </div>
    {/if}
    <a href="/">&larr; Back to Home</a>
</main>

<style>
    .container { max-width: 800px; margin: 50px auto; padding: 20px; font-family: sans-serif; }
    .card { background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-top: 20px; }
    .error { border-color: red; color: red; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .status { font-style: italic; color: #555; }
    .status.saving { color: #007bff; }
    .status.saved { color: #28a745; }
    .status.error { color: #dc3545; }
    .experience-box {
        width: 100%;
        min-height: 250px;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        font-family: inherit;
        font-size: 1rem;
        resize: vertical;
    }
    a { display: inline-block; margin-top: 20px; }
</style>