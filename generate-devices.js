const fs = require("fs");
const path = require("path");

const devicesFile = path.join(__dirname, "devices.json");
const outDir = path.join(__dirname, "gh-pages");

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const data = JSON.parse(fs.readFileSync(devicesFile, "utf8"));

function sanitizeFilename(name) {
    return name.replace(/[<>:"/\\|?*]/g, "_");
}

data.devices.forEach(device => {
    const safeName = sanitizeFilename(device.model);
    const filePath = path.join(outDir, safeName + ".html");

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${device.name}</title>
<style>
body { font-family: sans-serif; max-width: 800px; margin: 2rem auto; }
img { max-width: 100%; }
h1 { color: #2c3e50; }
</style>
</head>
<body>
<h1>${device.name} (${device.model})</h1>
<img src="${device.image}" alt="${device.name}">
<p><strong>Vendor:</strong> ${device.vendor}</p>
<p><strong>Chip:</strong> ${device.chip}</p>
<p><strong>Board:</strong> ${device.board}</p>
<p><strong>Detailed:</strong> ${device.bDetailed}</p>
<p><strong>Keywords:</strong> ${device.keywords.join(", ")}</p>
<h2>Pins</h2>
<ul>
${Object.entries(device.pins).map(([pin, val]) => `<li>${pin}: ${val}</li>`).join("\n")}
</ul>
<p><a href="${device.wiki}" target="_blank">Wiki / Details</a></p>
</body>
</html>
    `;
    fs.writeFileSync(filePath, html, "utf8");
});

console.log("Device pages generated in 'gh-pages' folder");
