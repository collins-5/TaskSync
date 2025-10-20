const { execSync } = require('child_process');


const message = process.argv.slice(2).join(' ');
if (!message) {
    console.error('USAGE: npm run update:production -- "your update message here"');
    process.exit(1);
}

execSync(`eas update --channel production --platform android --message ${JSON.stringify(message)}`, {
    stdio: 'inherit'
});
