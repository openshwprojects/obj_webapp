

var g_selectedPin;
const pins = [];
var ctx;
var canvas;
var image;

function selectPinByName(name)
{
    g_selectedPin = pins.find(pin => pin.name === name) || null;
}
function handleMouseEnter(event) {
  console.log(event.target.textContent.trim());
  const firstToken = event.target.textContent.trim().split(' ')[0];
  selectPinByName(firstToken);
  drawPins();
}

function createBeforeMainInternal() {
    const newDiv = document.createElement("div");
    newDiv.style.float = "left";
    newDiv.style.position = "sticky";
    newDiv.style.top = "0";
    newDiv.id = "pinsDiv";
    
    const mainDiv = document.getElementById("main");
    if (mainDiv) {
        mainDiv.parentNode.insertBefore(newDiv, mainDiv);
    }

	document.querySelectorAll('.hdiv .disp-inline').forEach(span => {
	  span.addEventListener('mouseenter', handleMouseEnter);
	});
    createCanvasInElement("pinsDiv"); 
}

function createBeforeMain() {
    window.addEventListener('load', createBeforeMainInternal);
}

    function createPins() {
        const leftStartX = 50;
        const rightStartX = 474;
        const leftStartY = 122;
        const leftStepY = 25.5;
        const leftPinCount = 15;
        const rightStartY = 107;
        const rightStepY = 25.4;
        const rightPinCount = 15;

        const leftPinNames = [
            "P23", "GND", "P20", "P21", "P22", "P23", "P22", "MISO", "SCLK",
            "GND", "3.3V", "EN", "RST", "GND", "Vin"
        ];
        const rightPinNames = [
            "GPIO16", "GPIO5", "GPIO4", "GPIO0", "GPIO2", "3.3V", "GND", "GPIO14", "GPIO12",
            "GPIO13", "GPIO15", "GPIO3", "GPIO1", "GND", "3.3V"
        ];

        function createPin(name, x, y, width, height, angle) {
            if(name == "GND") {
                name = "GND#000000#FFFFFF";
            } else if(name == "3.3V") {
                name = "3.3V#FF0000#000000";
            }
            const { name: pinName, backgroundColor, fontColor } = parsePinName(name);
            pins.push({
                name: pinName,
                x,
                y,
                width,
                height,
                backgroundColor,
                fontColor,
                angle
            });
        }

        function parsePinName(pinName) {
            const parts = pinName.split('#');
            const name = parts[0];    
            const backgroundColor = parts[1] ? '#' + parts[1] : 'gray';
            const fontColor = parts[2] ? '#' + parts[2] : 'black';
            return { name, backgroundColor, fontColor };
        }

        for (let i = 0; i < leftPinCount; i++) {
            const x = leftStartX;
            const y = leftStartY + i * leftStepY;
            createPin(leftPinNames[i], x, y, 70, 20, 0);
        }

        for (let i = 0; i < rightPinCount; i++) {
            const x = rightStartX;
            const y = rightStartY + i * rightStepY;
            createPin(rightPinNames[i], x, y, 70, 20, 180);
        }
    }

    function drawHandle(x, y, angle, len) {
        var len = 50;
        var tgX = x + len * Math.cos(angle * Math.PI / 180);
        var tgY = y + len * Math.sin(angle * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tgX, tgY);
        ctx.strokeStyle = "gray"; 
        ctx.lineWidth = 3; 
        ctx.stroke(); 
        ctx.closePath();
        
        ctx.beginPath();
        ctx.arc(tgX, tgY, 10, 0, 2 * Math.PI); 
        ctx.fillStyle = "blue";
        ctx.fill(); 
        ctx.closePath();
    }

    function drawPins(mouseX = null, mouseY = null) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        pins.forEach(pin => {
            const isMouseOver = 
                mouseX !== null && 
                mouseX >= pin.x - 5 && 
                mouseX <= pin.x - 5 + pin.width && 
                mouseY >= pin.y - 15 && 
                mouseY <= pin.y - 15 + pin.height;

            if (isMouseOver) {
				selectPinByName(pin.name);
            }
			if(g_selectedPin == pin)
			{
                ctx.strokeStyle = "red";
                ctx.lineWidth = 3;
                ctx.strokeRect(pin.x - 8, pin.y - 18, pin.width + 6, pin.height + 6);
			}
            var handleX;
            if (pin.angle == 0) {
                handleX = pin.x + pin.width;
            } else {
                handleX = pin.x - 8;
            }
            drawHandle(handleX, pin.y - 7, pin.angle);

            ctx.fillStyle = pin.backgroundColor;
            ctx.fillRect(pin.x - 5, pin.y - 15, pin.width, pin.height);

            ctx.font = "16px Arial"; 
            ctx.fillStyle = pin.fontColor;
            ctx.fillText(pin.name, pin.x, pin.y);
        });
    }
function createCanvasInElement(id) {
    canvas = document.createElement("canvas");
    canvas.id = "pinCanvas";
    canvas.width = 600;
    canvas.height = 600;
    document.getElementById(id).appendChild(canvas);

    ctx = canvas.getContext("2d");

    image = new Image();
    image.src = "https://i.imgur.com/l3osEzH.png";



    image.onload = () => {
        createPins();
        drawPins();
    };

    canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        drawPins(mouseX, mouseY);
    });
}
