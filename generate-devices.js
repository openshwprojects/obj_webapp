const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "gh-pages");

// 1️⃣ Nuke previous gh-pages content
if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// 2️⃣ Copy all files from repo (excluding gh-pages itself)
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

// 3️⃣ Load devices.json
const devicesFile = path.join(__dirname, "devices.json");
if (!fs.existsSync(devicesFile)) {
    console.log("No devices.json found, skipping device pages");
    process.exit(0);
}
const data = JSON.parse(fs.readFileSync(devicesFile, "utf8"));


// 4️⃣ Create devices/ folder
const devicesDir = path.join(outDir, "devices");
fs.mkdirSync(devicesDir, { recursive: true });

const { processJSON_OpenBekenTemplateStyle, pageNameForDevice, sanitizeFilename } = require(path.join(__dirname, "templateParser.js"));

function createDeviceHTML(device, safeName) {
    const detailed = !!device.bDetailed;
    const englishLink = device.wiki || "#";
    const polishLink = englishLink !== "#" ? englishLink.replace(".com", ".pl") : "https://www.elektroda.pl/rtvforum/";

    // Use external parser for pins
    const parsed = processJSON_OpenBekenTemplateStyle(device);
    const pinsDesc = parsed.desc.replace(/\n/g, "<br>");

    // Raw template JSON pretty
    const rawTemplate = JSON.stringify(device, null, 2);

 return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${device.name || safeName}</title>
<style>
body { font-family: sans-serif; max-width: 1000px; margin: 2rem auto; padding: 1rem; }
h1 { color: #2c3e50; }
img { max-width: 100%; height: auto; border-radius: 8px; }
.bigtext { font-size: 1.4rem; font-weight: bold; margin-top: 2rem; }
.smalltext { font-size: 0.9rem; color: #555; margin-top: 0.5rem; }
textarea { width: 100%; height: 300px; font-family: monospace; }
.copy-btn { margin-top: 0.5rem; padding: 0.3rem 0.6rem; cursor: pointer; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1.5rem; }
.full { grid-column: 1 / -1; }
@media (max-width: 700px) {
  .grid { grid-template-columns: 1fr; }
}
</style>
</head>
<body>
<h5>Firmware change information, guide, template, tutorial and help for...</h5>
<h1>${device.name || safeName} (${device.model || ""})</h1>

<div class="grid">
  <div>
    ${device.image ? `<img src="${device.image}" alt="${device.name || safeName}">` : ""}
  </div>
  <div>
    <h2>Information</h2>
    <p><strong>Vendor:</strong> ${device.vendor || "N/A"}</p>
    <p><strong>Chip:</strong> ${device.chip || "N/A"}</p>
    <p><strong>Board:</strong> ${device.board || "N/A"}</p>
    <p><strong>Detailed:</strong> ${device.bDetailed || "N/A"}</p>
    <p><strong>Keywords:</strong> ${(device.keywords || []).join(", ")}</p>
  </div>

  <div>
    <h2>Device Template</h2>
    <textarea readonly id="deviceTemplate">${rawTemplate}</textarea>
    <button class="copy-btn" onclick="copyTemplate()">Copy</button>
  </div>
  <div>
    <h2>Pins</h2>
    <div>${pinsDesc || "No pin description available."}</div>
  </div>

  <div class="full">
    <div class="bigtext">
    ${detailed 
      ? `Read detailed flashing guide and get help in device topic: <a href="${englishLink}" target="_blank">English</a>, <a href="${polishLink}" target="_blank">Polish</a>`
      : `Read more information and get help on forum: <a href="${englishLink}" target="_blank">English</a>, <a href="${polishLink}" target="_blank">Polish</a>`
    }
    </div>
    ${device.product ? `<div class="smalltext">You can also visit <a href="${device.product}" target="_blank">shop site</a>.</div>` : ""}
    <div class="smalltext">Return to <a href="../devicesList.html">devices list</a>.</div>
  </div>
</div>

<script>
function copyTemplate() {
    const txt = document.getElementById("deviceTemplate");
    txt.select();
    document.execCommand("copy");
    alert("Device template copied!");
}
</script>
</body>
</html>
`;

}




function processDevice(device, devicesDir) {
    const baseName = pageNameForDevice(device);
    const safeName = sanitizeFilename(baseName);
    const filePath = path.join(devicesDir, safeName + ".html");
    const html = createDeviceHTML(device, safeName);
    fs.writeFileSync(filePath, html, "utf8");
}

// 5️⃣ Generate HTML pages for each device
data.devices.forEach(device => processDevice(device, devicesDir));


console.log("Previous content nuked, all repo files copied, and device pages generated in 'gh-pages/devices/'");
