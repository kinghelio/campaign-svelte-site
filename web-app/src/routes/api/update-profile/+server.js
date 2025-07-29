import { Storage } from '@google-cloud/storage';
import { json } from '@sveltejs/kit';

const updateStorage = new Storage();
const updateBucketName = 'cactus-disbelief2-wheat-kudos-unlaced'; // <-- IMPORTANT: CHANGE THIS


export async function POST({ request, params }) {
    const code = params.code;
    const updatedData = await request.json(); // This will contain { experienceText: "..." }
    const fileName = `${code}.json`;
    
    try {
        const file = updateStorage.bucket(updateBucketName).file(fileName);
        const [content] = await file.download();
        const existingProfile = JSON.parse(content.toString());
        
        // Merge new data into existing data
        const newProfile = { existingProfile, updatedData };
        
        await file.save(JSON.stringify(newProfile, null, 2), {
            contentType: 'application/json'
        });
        
        return json({ success: true });

    } catch (error) {
        console.error('[API-UPDATE] 🛑 FAILED TO UPDATE PROFILE:', error);
        return json({ error: 'Could not update profile.' }, { status: 500 });
    }
}