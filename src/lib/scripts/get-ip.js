const { exec } = require('child_process');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');
// eslint-disable-next-line no-undef
const envPath = join(__dirname, '../../../.env.local');

exec('ipconfig', (err, stdout) => {
  if (err) {
    console.error('❌ Failed to run ipconfig:', err);
    return;
  }

  // Split the output into sections for each adapter
  const sections = stdout.split(/(?=\w.*adapter)/);

  // Find the Wi-Fi adapter section
  const wifiSection = sections.find(
    (section) => section.includes('Wireless LAN adapter Wi-Fi:') || section.includes('Wi-Fi')
  );

  if (!wifiSection) {
    console.error('❌ Wi-Fi adapter not found.');
    return;
  }

  // Extract IPv4 address from the Wi-Fi section
  const ipv4Regex = /IPv4 Address[.\s]*:\s*([\d.]+)/;
  const match = wifiSection.match(ipv4Regex);

  if (!match) {
    console.error('❌ IPv4 address not found in Wi-Fi adapter.');
    return;
  }

  const ip = match[1];
  const backendUrl = `http://${ip}:8000`;

  let envContent = '';
  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, 'utf-8');
  } else {
    console.warn('⚠️ .env.local not found, a new one will be created.');
  }

  const updatedEnv = envContent.match(/^EXPO_PUBLIC_BACKEND_URL=/m)
    ? envContent.replace(/^EXPO_PUBLIC_BACKEND_URL=.*/m, `EXPO_PUBLIC_BACKEND_URL=${backendUrl}`)
    : envContent + `\nEXPO_PUBLIC_BACKEND_URL=${backendUrl}`;

  writeFileSync(envPath, updatedEnv.trim() + '\n', 'utf-8');
  console.log(`✅ EXPO_PUBLIC_BACKEND_URL updated to: ${backendUrl}`);
  console.log(`📡 Using Wi-Fi IP address: ${ip}`);
});
