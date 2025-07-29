import { Storage } from '@google-cloud/storage';
import { json } from '@sveltejs/kit';

const storage = new Storage();
const bucketName = 'cactus-disbelief2-wheat-kudos-unlaced'; // <-- IMPORTANT: CHANGE THIS

export async function POST({ request }) {
    const { name, email, bio } = await request.json();

    if (!name) {
        return json({ error: 'Name and Email are required.' }, { status: 400 });
    }

    // Generate a simple 6-digit random code
    const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
    const fileName = `${accessCode}.json`;

    const profileData = { name, email, bio, createdAt: new Date().toISOString() };

    try {
        const file = storage.bucket(bucketName).file(fileName);
        await file.save(JSON.stringify(profileData), {
            contentType: 'application/json'
        });

        // Return the access code to the user
        return json({ accessCode });

    } catch (error) {
        console.error('Failed to create profile:', error);
        return json({ error: 'Could not create profile.' }, { status: 500 });
    }
}