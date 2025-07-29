<script lang="ts">
    import { page } from '$app/state';
    import { onMount } from 'svelte';

    export let data;

    // --- State for Profile Data ---
    let experienceText = '';
    let savedExperienceText = ''; // For displaying the confirmed saved value
    let saveStatus: 'idle' | 'saving' | 'saved' | 'error' = 'idle';
    let debounceTimer: NodeJS.Timeout;

    // Initialize local state when component mounts
    // Initialize local state when component mounts
    onMount(() => {
        const initialText = data.profile?.experienceText || '';
        experienceText = initialText;
        savedExperienceText = initialText;
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
            <h3>Current Exp</h3>{savedExperienceText}
                        
            <input
                type="text"
                class="experience-input"
                placeholder="Enter your current experience here..."
                bind:value={experienceText}
                on:input={triggerSave}
            />
         </div>
         <div class="card">            
            <h3>Current Points</h3>{savedExperienceText}
                        
            <input
                type="text"
                class="points-input"
                placeholder="Enter your current points here..."
                bind:value={pointsText}
                on:input={triggerSave}
            />
         </div>

        <div class="status {saveStatus}">
                    {#if saveStatus === 'idle'}Idle...{/if}
                    {#if saveStatus === 'saving'}Saving...{/if}
                    {#if saveStatus === 'saved'}✓ All changes saved{/if}
                    {#if saveStatus === 'error'}✗ Error saving{/if}
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
    .display-box {
        background: #fff;
        border: 1px solid #ccc;
        padding: 15px;
        border-radius: 4px;
        min-height: 40px; /* Adjusted min-height */
        white-space: pre-wrap; /* Preserves whitespace and line breaks */
        word-wrap: break-word;
    }
    .experience-input {
        width: 100%;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        font-family: inherit;
        font-size: 1rem;
    }
    a { display: inline-block; margin-top: 20px; }
</style>
