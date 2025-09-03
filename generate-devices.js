const fs = require("fs");
const path = require("path");

const devicesFile = path.join(__dirname, "devices.json");
const outDir = path.join(__dirname, "gh-pages");

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const data = JSON.parse(fs.readFileSync(devicesFile, "utf8"));

function sanitizeFilename(name) {
    if (!name) name = "unknown";
    return name.replace(/[<>:"/\\|?*]/g, "_");
}

data.devices.forEach(device => {
    const baseName = device.model || device.name || "unknown";
    const safeName = sanitizeFilename(baseName);
    const filePath = path.join(outDir, safeName + ".html");

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

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

console.log("Device pages generated in 'gh-pages' folder");
