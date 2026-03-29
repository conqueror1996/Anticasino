/**
 * Ghost Browser - CLI Manager
 * 
 * Simple interface to manage your "Identities".
 */

const fs = require('fs');
const path = require('path');
const GhostLauncher = require('./launcher');
const IdentityFactory = require('./engine/identity_factory');

const PROFILES_DIR = path.join(__dirname, '../profiles');

async function listProfiles() {
    const files = fs.readdirSync(PROFILES_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    console.log('\n--- Ghost Browser Profiles ---');
    jsonFiles.forEach((f, i) => {
        const data = JSON.parse(fs.readFileSync(path.join(PROFILES_DIR, f), 'utf8'));
        console.log(`${i + 1}. [${f.replace('.json', '')}] - ${data.platform} (${data.deviceMemory}GB RAM)`);
    });
}

async function startProfile(name) {
    const ghost = new GhostLauncher();
    // In a real app, you would pass proxy info here
    const { context, page } = await ghost.launch(name, {
        headless: false
    });
    
    console.log(`[Ghost] Profile [${name}] is now running.`);
    console.log(`[Ghost] Close the browser window to stop.`);
}

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === 'list') {
    listProfiles();
} else if (command === 'launch') {
    const name = args[1] || 'default';
    startProfile(name);
} else if (command === 'create') {
    const name = args[1];
    if (name) {
        IdentityFactory.loadOrGenerate(name);
        console.log(`[Ghost] Profile [${name}] created.`);
    } else {
        console.log('Error: Give the profile a name.');
    }
} else {
    console.log('Available commands: list, launch <name>, create <name>');
}
