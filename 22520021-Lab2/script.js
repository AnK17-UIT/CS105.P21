"use strict";

function main() {
    // Get WebGL context
    const canvas = document.querySelector("#canvas");
    const gl = canvas.getContext("webgl");
    if (!gl) {
        console.error("WebGL is not supported on this browser!");
        return;
    }

    // Setup GLSL program
    const program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

    // Look up attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const colorLocation = gl.getUniformLocation(program, "u_color");
    const translationLocation = gl.getUniformLocation(program, "u_translation");
    const rotationLocation = gl.getUniformLocation(program, "u_rotation");
    const scaleLocation = gl.getUniformLocation(program, "u_scale");

    // Create a buffer for positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Define the 'F' shape using triangles
    const fPositions = [
        // Left column (2 triangles)
        0, 0,      // Bottom-left
        30, 0,     // Bottom-right
        0, 150,    // Top-left
        0, 150,    // Top-left
        30, 0,     // Bottom-right
        30, 150,   // Top-right

        // Top rung (2 triangles)
        30, 0,     // Bottom-left
        100, 0,    // Bottom-right
        30, 30,    // Top-left
        30, 30,    // Top-left
        100, 0,    // Bottom-right
        100, 30,   // Top-right

        // Middle rung (2 triangles)
        30, 60,    // Bottom-left
        67, 60,    // Bottom-right
        30, 90,    // Top-left
        30, 90,    // Top-left
        67, 60,    // Bottom-right
        67, 90     // Top-right
    ];

    // Define multiple moving shapes (rectangle and triangle)
    const movingShapes = [
        {
            // Rectangle (2 triangles)
            positions: [
                // First triangle
                0, 0,
                50, 0,
                0, 30,
                // Second triangle
                0, 30,
                50, 0,
                50, 30
            ],
            color: [1, 0, 0, 1], // Red
            translation: [100, 150],
            rotation: [0, 1],
            scale: [1, 1],
            translationSpeed: [2, 1],
            rotationSpeed: 0.02,
            scaleSpeed: 0.01,
            count: 6
        },
        {
            // Triangle
            positions: [
                0, 0,
                40, 0,
                20, 40
            ],
            color: [0, 1, 0, 1], // Green
            translation: [200, 200],
            rotation: [0, 1],
            scale: [1, 1],
            translationSpeed: [-1, 2],
            rotationSpeed: -0.03,
            scaleSpeed: -0.015,
            count: 3
        }
    ];

    // Initial transformation parameters for 'F'
    let fTranslation = [100, 150];
    let fRotation = [0, 1]; // Initial rotation (0 degrees)
    let fScale = [1.0, 1.0];
    const fColor = [0.0, 0.7, 1.0, 1.0]; // Cyan color for 'F'

    // Program state
    let currentProgram = "drawF"; // Default program
    let selectedShapeIndex = 0; // Default to rectangle (index 0)
    let animationFrameId;

    // Setup UI sliders
    let sliders = {
        x: webglLessonsUI.setupSlider("#x", { value: fTranslation[0], slide: updatePosition(0), max: canvas.width }),
        y: webglLessonsUI.setupSlider("#y", { value: fTranslation[1], slide: updatePosition(1), max: canvas.height }),
        angle: webglLessonsUI.setupSlider("#angle", { slide: updateAngle, max: 360 }),
        scaleX: webglLessonsUI.setupSlider("#scaleX", { value: fScale[0], slide: updateScale(0), min: 0.1, max: 3, step: 0.1 }),
        scaleY: webglLessonsUI.setupSlider("#scaleY", { value: fScale[1], slide: updateScale(1), min: 0.1, max: 3, step: 0.1 })
    };

    // Setup object selection
    const objectSelect = document.getElementById("objectSelect");
    objectSelect.addEventListener("change", () => {
        if (currentProgram === "movingShapes") {
            selectedShapeIndex = objectSelect.value === "rect" ? 0 : 1;
            updateUIValues();
        }
    });

    function updatePosition(index) {
        return function(event, ui) {
            if (currentProgram === "drawF") {
                fTranslation[index] = ui.value;
                drawScene();
            } else if (currentProgram === "movingShapes") {
                movingShapes[selectedShapeIndex].translation[index] = ui.value;
                drawScene();
            }
        };
    }

    function updateAngle(event, ui) {
        const angleInDegrees = 360 - ui.value;
        const angleInRadians = angleInDegrees * Math.PI / 180;
        if (currentProgram === "drawF") {
            fRotation[0] = Math.sin(angleInRadians);
            fRotation[1] = Math.cos(angleInRadians);
            drawScene();
        } else if (currentProgram === "movingShapes") {
            movingShapes[selectedShapeIndex].rotation[0] = Math.sin(angleInRadians);
            movingShapes[selectedShapeIndex].rotation[1] = Math.cos(angleInRadians);
            drawScene();
        }
    }

    function updateScale(index) {
        return function(event, ui) {
            if (currentProgram === "drawF") {
                fScale[index] = ui.value;
                drawScene();
            } else if (currentProgram === "movingShapes") {
                movingShapes[selectedShapeIndex].scale[index] = ui.value;
                drawScene();
            }
        };
    }

    // Draw the 'F' program
    function drawF() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);
        gl.enableVertexAttribArray(positionLocation);

        // Bind position buffer and set geometry for 'F'
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fPositions), gl.STATIC_DRAW);

        // Setup vertex attribute pointer
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Set uniforms
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform4fv(colorLocation, fColor);
        gl.uniform2fv(translationLocation, fTranslation);
        gl.uniform2fv(rotationLocation, fRotation);
        gl.uniform2fv(scaleLocation, fScale);

        // Draw the 'F' (6 triangles, 18 vertices)
        gl.drawArrays(gl.TRIANGLES, 0, 18);

        // Update UI values
        updateUIValues();
    }

    // Draw the moving shapes program
    function drawMovingShapes() {
        movingShapes.forEach(obj => {
            // Automatic translation
            obj.translation[0] += obj.translationSpeed[0];
            obj.translation[1] += obj.translationSpeed[1];

            // Bounce back when hitting canvas boundaries
            if (obj.translation[0] < 0 || obj.translation[0] > canvas.width - 50) {
                obj.translationSpeed[0] *= -1;
            }
            if (obj.translation[1] < 0 || obj.translation[1] > canvas.height - 50) {
                obj.translationSpeed[1] *= -1;
            }

            // Automatic rotation
            const angle = Math.atan2(obj.rotation[0], obj.rotation[1]) + obj.rotationSpeed;
            obj.rotation[0] = Math.sin(angle);
            obj.rotation[1] = Math.cos(angle);

            // Automatic scaling
            obj.scale[0] += obj.scaleSpeed;
            obj.scale[1] += obj.scaleSpeed;
            if (obj.scale[0] < 0.5 || obj.scale[0] > 2) {
                obj.scaleSpeed *= -1;
            }
            obj.scale[0] = Math.max(0.5, Math.min(2, obj.scale[0]));
            obj.scale[1] = Math.max(0.5, Math.min(2, obj.scale[1]));
        });

        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);
        gl.enableVertexAttribArray(positionLocation);

        // Draw each shape
        movingShapes.forEach(obj => {
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.positions), gl.STATIC_DRAW);

            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
            gl.uniform4fv(colorLocation, obj.color);
            gl.uniform2fv(translationLocation, obj.translation);
            gl.uniform2fv(rotationLocation, obj.rotation);
            gl.uniform2fv(scaleLocation, obj.scale);

            gl.drawArrays(gl.TRIANGLES, 0, obj.count);
        });

        // Update UI values
        updateUIValues();
    }

    function updateUIValues() {
        if (currentProgram === "drawF") {
            document.querySelector("#x .gman-widget-value").textContent = fTranslation[0].toFixed(0);
            document.querySelector("#y .gman-widget-value").textContent = fTranslation[1].toFixed(0);
            document.querySelector("#angle .gman-widget-value").textContent = ((360 - Math.atan2(fRotation[0], fRotation[1]) * 180 / Math.PI) % 360).toFixed(0);
            document.querySelector("#scaleX .gman-widget-value").textContent = fScale[0].toFixed(2);
            document.querySelector("#scaleY .gman-widget-value").textContent = fScale[1].toFixed(2);
        } else if (currentProgram === "movingShapes") {
            const obj = movingShapes[selectedShapeIndex];
            document.querySelector("#x .gman-widget-value").textContent = obj.translation[0].toFixed(0);
            document.querySelector("#y .gman-widget-value").textContent = obj.translation[1].toFixed(0);
            document.querySelector("#angle .gman-widget-value").textContent = ((360 - Math.atan2(obj.rotation[0], obj.rotation[1]) * 180 / Math.PI) % 360).toFixed(0);
            document.querySelector("#scaleX .gman-widget-value").textContent = obj.scale[0].toFixed(2);
            document.querySelector("#scaleY .gman-widget-value").textContent = obj.scale[1].toFixed(2);
        }
    }

    // Animation loop
    function animate() {
        if (currentProgram === "drawF") {
            drawF();
        } else {
            drawMovingShapes();
        }
        animationFrameId = requestAnimationFrame(animate);
    }

    // Switch between programs
    document.getElementById("drawFBtn").addEventListener("click", () => {
        if (currentProgram !== "drawF") {
            currentProgram = "drawF";
            objectSelect.style.display = "none"; // Ẩn dropdown
            cancelAnimationFrame(animationFrameId);
            drawF();
            animate();
        }
    });

    document.getElementById("movingShapesBtn").addEventListener("click", () => {
        if (currentProgram !== "movingShapes") {
            currentProgram = "movingShapes";
            objectSelect.style.display = "block"; // Hiển thị dropdown
            cancelAnimationFrame(animationFrameId);
            drawMovingShapes();
            animate();
        }
    });

    // Initial draw
    animate();
}

main();