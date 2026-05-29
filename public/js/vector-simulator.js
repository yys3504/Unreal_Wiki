(function () {
    var canvas = document.getElementById("vector-sim-canvas");
    if (!canvas) {
        return;
    }

    var ctx = canvas.getContext("2d");
    if (!ctx) {
        return;
    }

    function v3(x, y, z) {
        return { x: x, y: y, z: z };
    }

    function v2(x, y) {
        return v3(x, y, 0);
    }

    function add(a, b) {
        return v2(a.x + b.x, a.y + b.y);
    }

    function sub(a, b) {
        return v2(a.x - b.x, a.y - b.y);
    }

    function scale(a, s) {
        return v2(a.x * s, a.y * s);
    }

    function dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }

    function cross3d(a, b) {
        return v3(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        );
    }

    function magnitude(a) {
        return Math.sqrt(a.x * a.x + a.y * a.y);
    }

    function normalize(a) {
        var m = magnitude(a);
        if (m < 0.0001) {
            return v2(0, 0);
        }
        return v2(a.x / m, a.y / m);
    }

    function formatVector2(a) {
        return "(" + a.x.toFixed(2) + ", " + a.y.toFixed(2) + ")";
    }

    function formatVector3(a) {
        return "(" + a.x.toFixed(2) + ", " + a.y.toFixed(2) + ", " + a.z.toFixed(2) + ")";
    }

    var controls = {
        ax: document.getElementById("vec-ax"),
        ay: document.getElementById("vec-ay"),
        az: document.getElementById("vec-az"),
        bx: document.getElementById("vec-bx"),
        by: document.getElementById("vec-by"),
        bz: document.getElementById("vec-bz"),
        scalar: document.getElementById("vec-scalar"),
        axVal: document.getElementById("vec-ax-val"),
        ayVal: document.getElementById("vec-ay-val"),
        azVal: document.getElementById("vec-az-val"),
        bxVal: document.getElementById("vec-bx-val"),
        byVal: document.getElementById("vec-by-val"),
        bzVal: document.getElementById("vec-bz-val"),
        scalarVal: document.getElementById("vec-scalar-val"),
        formula: document.getElementById("vec-formula"),
        result: document.getElementById("vec-result"),
        hint: document.getElementById("vec-result-hint"),
        wrap: document.getElementById("vector-sim-wrap"),
        modeButtons: document.querySelectorAll(".vector-op-btn[data-mode]")
    };

    var state = {
        mode: "add",
        a: v3(2.4, 1.2, 1.0),
        b: v3(-1.4, 2.0, -0.8),
        scalar: 1.2,
        viewYaw: Math.PI / 4,
        drag: {
            isActive: false,
            pointerId: null,
            startX: 0,
            startYaw: 0
        },
        width: 760,
        height: 460,
        detail: {
            formula: "R = A + B",
            resultText: "(0.00, 0.00)",
            hint: "A와 B를 더한 결과 벡터입니다.",
            resultVec: v3(0, 0, 0),
            projection: v3(0, 0, 0),
            crossVisualScale: 1
        }
    };

    function toScreen(vec, originX, originY, unit) {
        return {
            x: originX + vec.x * unit,
            y: originY - vec.y * unit
        };
    }

    function rotateAroundZ(vec, angle) {
        var cosA = Math.cos(angle);
        var sinA = Math.sin(angle);
        return v3(
            vec.x * cosA - vec.y * sinA,
            vec.x * sinA + vec.y * cosA,
            vec.z
        );
    }

    function yawDegrees() {
        var deg = (state.viewYaw * 180 / Math.PI) % 360;
        if (deg < 0) {
            deg += 360;
        }
        return deg;
    }

    function updateControlText() {
        controls.axVal.textContent = Number(state.a.x).toFixed(1);
        controls.ayVal.textContent = Number(state.a.y).toFixed(1);
        if (controls.azVal) {
            controls.azVal.textContent = Number(state.a.z).toFixed(1);
        }
        controls.bxVal.textContent = Number(state.b.x).toFixed(1);
        controls.byVal.textContent = Number(state.b.y).toFixed(1);
        if (controls.bzVal) {
            controls.bzVal.textContent = Number(state.b.z).toFixed(1);
        }
        controls.scalarVal.textContent = Number(state.scalar).toFixed(1);
    }

    function computeCurrent() {
        var a = state.a;
        var b = state.b;
        var s = state.scalar;
        var resultVec = v3(0, 0, 0);
        var formula = "R = A + B";
        var resultText = "";
        var hint = "";
        var projection = v3(0, 0, 0);
        var crossVisualScale = 1;

        if (state.mode === "add") {
            resultVec = add(a, b);
            formula = "R = A + B";
            resultText = formatVector2(resultVec);
            hint = "A와 B를 더한 결과 벡터입니다.";
        } else if (state.mode === "sub") {
            resultVec = sub(a, b);
            formula = "R = A - B";
            resultText = formatVector2(resultVec);
            hint = "A에서 B를 뺀 방향 벡터입니다.";
        } else if (state.mode === "scalar") {
            resultVec = scale(a, s);
            formula = "R = kA (k=" + s.toFixed(1) + ")";
            resultText = formatVector2(resultVec);
            hint = "A의 방향을 유지하면서 크기를 k배로 조절합니다.";
        } else if (state.mode === "normalize") {
            resultVec = normalize(a);
            formula = "R = normalize(A)";
            resultText = formatVector2(resultVec);
            hint = "A의 길이를 1로 맞춘 단위벡터입니다.";
        } else if (state.mode === "dot") {
            var d = dot(a, b);
            var aLenSq = a.x * a.x + a.y * a.y;
            var ratio = aLenSq < 0.0001 ? 0 : d / aLenSq;
            projection = scale(a, ratio);
            resultVec = projection;
            formula = "A · B";
            resultText = d.toFixed(3);
            hint = "스칼라 결과입니다. (양수: 유사 방향, 음수: 반대 방향)";
        } else if (state.mode === "cross") {
            var c = cross3d(a, b);
            var maxComp = Math.max(Math.abs(c.x), Math.abs(c.y), Math.abs(c.z));
            crossVisualScale = maxComp > 4 ? 4 / maxComp : 1;
            resultVec = c;
            formula = "A x B (3D)";
            resultText = formatVector3(c);
            hint = crossVisualScale < 1
                ? "3D 외적 결과 벡터입니다. 화면에는 보기 쉽게 축소해서 표시합니다. 캔버스를 드래그하면 Z축 기준으로 360도 회전할 수 있습니다."
                : "3D 외적 결과 벡터입니다. A와 B 모두에 수직입니다. 캔버스를 드래그하면 Z축 기준으로 360도 회전할 수 있습니다.";
        }

        state.detail = {
            formula: formula,
            resultText: resultText,
            hint: hint,
            resultVec: resultVec,
            projection: projection,
            crossVisualScale: crossVisualScale
        };
    }

    function updateReadout() {
        controls.formula.textContent = state.detail.formula;
        controls.result.textContent = state.detail.resultText;
        controls.hint.textContent = state.detail.hint;
    }

    function drawArrow2d(vec, color, label, lineWidth) {
        var originX = state.width * 0.5;
        var originY = state.height * 0.62;
        var unit = Math.min(state.width, state.height) / 10;
        var end = toScreen(vec, originX, originY, unit);

        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        var angle = Math.atan2(end.y - originY, end.x - originX);
        var head = 12;
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - head * Math.cos(angle - Math.PI / 7), end.y - head * Math.sin(angle - Math.PI / 7));
        ctx.lineTo(end.x - head * Math.cos(angle + Math.PI / 7), end.y - head * Math.sin(angle + Math.PI / 7));
        ctx.closePath();
        ctx.fill();

        ctx.font = "600 13px Segoe UI";
        ctx.fillText(label, end.x + 8, end.y - 8);
        ctx.restore();
    }

    function drawGrid2d() {
        ctx.clearRect(0, 0, state.width, state.height);
        ctx.fillStyle = "#111722";
        ctx.fillRect(0, 0, state.width, state.height);

        var originX = state.width * 0.5;
        var originY = state.height * 0.62;
        var unit = Math.min(state.width, state.height) / 10;

        ctx.strokeStyle = "#223048";
        ctx.lineWidth = 1;
        for (var x = originX % unit; x < state.width; x += unit) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, state.height);
            ctx.stroke();
        }
        for (var y = originY % unit; y < state.height; y += unit) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(state.width, y);
            ctx.stroke();
        }

        ctx.strokeStyle = "#4f5f79";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, originY);
        ctx.lineTo(state.width, originY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, state.height);
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "600 12px Segoe UI";
        ctx.fillText("X", state.width - 18, originY - 8);
        ctx.fillText("Y", originX + 8, 16);
    }

    function drawProjectionHint2d() {
        if (state.mode !== "dot") {
            return;
        }

        var originX = state.width * 0.5;
        var originY = state.height * 0.62;
        var unit = Math.min(state.width, state.height) / 10;
        var bTip = toScreen(state.b, originX, originY, unit);
        var pTip = toScreen(state.detail.projection, originX, originY, unit);

        ctx.save();
        ctx.setLineDash([6, 5]);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bTip.x, bTip.y);
        ctx.lineTo(pTip.x, pTip.y);
        ctx.stroke();
        ctx.restore();
    }

    function project3d(vec, originX, originY, unit) {
        var r = rotateAroundZ(vec, state.viewYaw);
        return {
            x: originX + (r.x - r.y) * unit * 0.9,
            y: originY - r.z * unit - (r.x + r.y) * unit * 0.35
        };
    }

    function drawArrow3d(vec, color, label, lineWidth, originX, originY, unit) {
        var end = project3d(vec, originX, originY, unit);

        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        var angle = Math.atan2(end.y - originY, end.x - originX);
        var head = 11;
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - head * Math.cos(angle - Math.PI / 7), end.y - head * Math.sin(angle - Math.PI / 7));
        ctx.lineTo(end.x - head * Math.cos(angle + Math.PI / 7), end.y - head * Math.sin(angle + Math.PI / 7));
        ctx.closePath();
        ctx.fill();

        ctx.font = "600 13px Segoe UI";
        ctx.fillText(label, end.x + 8, end.y - 8);
        ctx.restore();
    }

    function drawAxis3d(neg, pos, color, label, originX, originY, unit) {
        var n = project3d(neg, originX, originY, unit);
        var p = project3d(pos, originX, originY, unit);

        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.font = "600 12px Segoe UI";
        ctx.fillText(label, p.x + 6, p.y - 6);
        ctx.restore();
    }

    function drawScene2d() {
        drawGrid2d();
        drawArrow2d(state.a, "#60a5fa", "A", 3.5);
        drawArrow2d(state.b, "#22c55e", "B", 3.5);
        drawProjectionHint2d();
        drawArrow2d(state.detail.resultVec, "#f59e0b", "R", 4.5);
    }

    function drawScene3dCross() {
        ctx.clearRect(0, 0, state.width, state.height);
        ctx.fillStyle = "#111722";
        ctx.fillRect(0, 0, state.width, state.height);

        var originX = state.width * 0.5;
        var originY = state.height * 0.72;
        var axisExtent = 4;
        var unit = Math.min(state.width, state.height) / 10;

        drawAxis3d(v3(-axisExtent, 0, 0), v3(axisExtent, 0, 0), "#4f5f79", "X", originX, originY, unit);
        drawAxis3d(v3(0, -axisExtent, 0), v3(0, axisExtent, 0), "#4f5f79", "Y", originX, originY, unit);
        drawAxis3d(v3(0, 0, -axisExtent), v3(0, 0, axisExtent), "#7c8aa3", "Z", originX, originY, unit);

        var viewScale = state.detail.crossVisualScale;
        var drawA = v3(state.a.x * viewScale, state.a.y * viewScale, state.a.z * viewScale);
        var drawB = v3(state.b.x * viewScale, state.b.y * viewScale, state.b.z * viewScale);
        var drawR = v3(
            state.detail.resultVec.x * viewScale,
            state.detail.resultVec.y * viewScale,
            state.detail.resultVec.z * viewScale
        );

        drawArrow3d(drawA, "#60a5fa", "A", 3.2, originX, originY, unit);
        drawArrow3d(drawB, "#22c55e", "B", 3.2, originX, originY, unit);
        drawArrow3d(drawR, "#f59e0b", "A x B", 4.3, originX, originY, unit);

        var panelX = 14;
        var panelY = 14;
        ctx.fillStyle = "rgba(15, 23, 42, 0.84)";
        ctx.fillRect(panelX, panelY, 220, 54);
        ctx.strokeStyle = "#334155";
        ctx.strokeRect(panelX, panelY, 220, 54);
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "600 12px Segoe UI";
        ctx.fillText("View Rotation (Z)", panelX + 12, panelY + 20);
        ctx.font = "700 17px Segoe UI";
        ctx.fillStyle = "#38bdf8";
        ctx.fillText(yawDegrees().toFixed(0) + "°", panelX + 12, panelY + 43);
    }

    function drawScene() {
        if (state.mode === "cross") {
            drawScene3dCross();
            return;
        }
        drawScene2d();
    }

    function recalcAndRender() {
        computeCurrent();
        updateReadout();
        drawScene();
    }

    function setMode(mode) {
        state.mode = mode;
        controls.modeButtons.forEach(function (button) {
            button.classList.toggle("active", button.getAttribute("data-mode") === mode);
        });

        if (mode !== "cross") {
            state.drag.isActive = false;
        }

        if (controls.wrap) {
            controls.wrap.classList.toggle("cross-mode", mode === "cross");
            controls.wrap.classList.remove("dragging");
        }

        recalcAndRender();
    }

    function resizeCanvas() {
        var dpr = window.devicePixelRatio || 1;
        var rect = canvas.getBoundingClientRect();
        var width = Math.max(400, Math.floor(rect.width));
        var height = Math.max(360, Math.floor(width * 0.66));

        state.width = width;
        state.height = height;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        drawScene();
    }

    function bindInputs() {
        controls.ax.addEventListener("input", function () {
            state.a.x = parseFloat(controls.ax.value);
            updateControlText();
            recalcAndRender();
        });

        controls.ay.addEventListener("input", function () {
            state.a.y = parseFloat(controls.ay.value);
            updateControlText();
            recalcAndRender();
        });

        if (controls.az) {
            controls.az.addEventListener("input", function () {
                state.a.z = parseFloat(controls.az.value);
                updateControlText();
                recalcAndRender();
            });
        }

        controls.bx.addEventListener("input", function () {
            state.b.x = parseFloat(controls.bx.value);
            updateControlText();
            recalcAndRender();
        });

        controls.by.addEventListener("input", function () {
            state.b.y = parseFloat(controls.by.value);
            updateControlText();
            recalcAndRender();
        });

        if (controls.bz) {
            controls.bz.addEventListener("input", function () {
                state.b.z = parseFloat(controls.bz.value);
                updateControlText();
                recalcAndRender();
            });
        }

        controls.scalar.addEventListener("input", function () {
            state.scalar = parseFloat(controls.scalar.value);
            updateControlText();
            recalcAndRender();
        });

        controls.modeButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                setMode(button.getAttribute("data-mode"));
            });
        });

        window.addEventListener("resize", resizeCanvas);

        var rotateSensitivity = (Math.PI * 2) / 520;

        function onPointerDown(event) {
            if (state.mode !== "cross") {
                return;
            }

            state.drag.isActive = true;
            state.drag.pointerId = event.pointerId;
            state.drag.startX = event.clientX;
            state.drag.startYaw = state.viewYaw;

            if (canvas.setPointerCapture) {
                canvas.setPointerCapture(event.pointerId);
            }
            if (controls.wrap) {
                controls.wrap.classList.add("dragging");
            }
            event.preventDefault();
        }

        function onPointerMove(event) {
            if (!state.drag.isActive || event.pointerId !== state.drag.pointerId) {
                return;
            }

            var dx = event.clientX - state.drag.startX;
            state.viewYaw = state.drag.startYaw + dx * rotateSensitivity;
            drawScene();
        }

        function endPointerDrag(event) {
            if (!state.drag.isActive || event.pointerId !== state.drag.pointerId) {
                return;
            }

            state.drag.isActive = false;
            state.drag.pointerId = null;

            if (canvas.releasePointerCapture) {
                canvas.releasePointerCapture(event.pointerId);
            }
            if (controls.wrap) {
                controls.wrap.classList.remove("dragging");
            }
        }

        canvas.addEventListener("pointerdown", onPointerDown);
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerup", endPointerDrag);
        canvas.addEventListener("pointercancel", endPointerDrag);
    }

    function init() {
        controls.ax.value = state.a.x;
        controls.ay.value = state.a.y;
        if (controls.az) {
            controls.az.value = state.a.z;
        }
        controls.bx.value = state.b.x;
        controls.by.value = state.b.y;
        if (controls.bz) {
            controls.bz.value = state.b.z;
        }
        controls.scalar.value = state.scalar;

        updateControlText();
        bindInputs();
        resizeCanvas();
        setMode("add");
    }

    init();
})();
