const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "gh-pages");

// Clear previous gh-pages folder (optional)
if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// Copy all files from repo (excluding gh-pages itself)
function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(child => {
            if (child === "gh-pages") return; // skip gh-pages folder
            copyRecursive(path.join(src, child), path.join(dest, child));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}
copyRecursive(__dirname, outDir);

// Load devices.json
const devicesFile = path.join(__dirname, "devices.json");
if (!fs.existsSync(devicesFile)) {
    console.log("No devices.json found, skipping device pages");
    process.exit(0);
}
const data = JSON.parse(fs.readFileSync(devicesFile, "utf8"));

function sanitizeFilename(name) {
    if (!name) name = "unknown";
    return name.replace(/[<>:"/\\|?*]/g, "_");
}

// Create devices/ folder
const devicesDir = path.join(outDir, "devices");
fs.mkdirSync(devicesDir, { recursive: true });

data.devices.forEach(device => {
    const baseName = device.model || device.name || "unknown";
    const safeName = sanitizeFilename(baseName);
    const filePath = path.join(devicesDir, safeName + ".html");

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${device.name || safeName}</title>
<style>
body { font-family: sans-serif; max-width: 800px; margin: 2rem auto; }
img { max-width: 100%; }
h1 { color: #2c3e50; }
</style>
</head>
<body>
<h1>${device.name || safeName} (${device.model || ""})</h1>
${device.image ? `<img src="${device.image}" alt="${device.name || safeName}">` : ""}
<p><strong>Vendor:</strong> ${device.vendor || "N/A"}</p>
<p><strong>Chip:</strong> ${device.chip || "N/A"}</p>
<p><strong>Board:</strong> ${device.board || "N/A"}</p>
<p><strong>Detailed:</strong> ${device.bDetailed || "N/A"}</p>
<p><strong>Keywords:</strong> ${(device.keywords || []).join(", ")}</p>
<h2>Pins</h2>
<ul>
${Object.entries(device.pins || {}).map(([pin, val]) => `<li>${pin}: ${val}</li>`).join("\n")}
</ul>
${device.wiki ? `<p><a href="${device.wiki}" target="_blank">Wiki / Details</a></p>` : ""}
</body>
</html>
    `;
    fs.writeFileSync(filePath, html, "utf8");
});

console.log("All repo files copied and device pages generated in 'gh-pages/devices/'");
