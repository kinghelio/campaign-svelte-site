import { Storage } from '@google-cloud/storage';

const storage = new Storage({
    // Make sure your GCP credentials are set up in your environment
    // e.g., using a service account JSON file
});

const bucketName = 'cactus-disbelief2-wheat-kudos-unlaced'; // <-- IMPORTANT: CHANGE THIS

export async function load({ params }) {
    const code = params.code;
    const profileFileName = `${code}.json`;
    console.log(`[SERVER] Attempting to load profile for code: ${code}`);

    try {
        // 1. Fetch Profile JSON
        const profileFile = storage.bucket(bucketName).file(profileFileName);
        const [profileExists] = await profileFile.exists();

        if (!profileExists) {
            return { status: 404, error: 'Profile not found.' };
        }

        const [profileContent] = await profileFile.download();
        const profile = JSON.parse(profileContent.toString());
        console.log(`[SERVER] Successfully loaded profile for code: ${code}`);

        

        return { profile};

    } catch (error) {
        console.error('[SERVER] 🛑 FAILED TO FETCH PROFILE OR CSV:', error);
        return { status: 500, error: 'Could not retrieve profile data.' };
    }
}
