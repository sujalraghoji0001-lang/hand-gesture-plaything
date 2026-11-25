/**
 * Initializes MediaPipe Hands tracking with graceful mouse fallback.
 */
export class GestureController {
    constructor({ videoElement, onUpdate, onCameraError }) {
        this.video = videoElement;
        this.onUpdate = onUpdate;
        this.onCameraError = onCameraError;
        this.hue = 0.5;
        this.mouseMode = false;
        this.shapeIndex = 0;

        this.setupMouseFallback();
    }

    start() {
        try {
            const hands = new window.Hands({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
            });

            hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.6,
                minTrackingConfidence: 0.6
            });

            hands.onResults((results) => this.processLandmarks(results));

            const camera = new window.Camera(this.video, {
                onFrame: async () => {
                    await hands.send({ image: this.video });
                },
                width: 640,
                height: 480
            });

            camera.start().catch(() => this.enableFallback());
        } catch (err) {
            this.enableFallback();
        }
    }

    enableFallback() {
        if (this.mouseMode) return;
        this.mouseMode = true;
        this.video.style.display = 'none';
        if (this.onCameraError) this.onCameraError();
        this.onUpdate({
            label: 'NEBULA SPHERE (MOUSE MODE)',
            morph: [1, 0, 0, 0]
        });
    }

    setupMouseFallback() {
        const shapes = [
            { label: 'NEBULA SPHERE', morph: [1, 0, 0, 0] },
            { label: 'HEART STABILIZED', morph: [0, 1, 0, 0] },
            { label: 'SATURN RINGS', morph: [0, 0, 1, 0] },
            { label: 'STAR ALIGNMENT', morph: [0, 0, 0, 1] }
        ];

        window.addEventListener('mousemove', (e) => {
            if (!this.mouseMode) return;
            const nx = e.clientX / window.innerWidth;
            const ny = e.clientY / window.innerHeight;
            this.onUpdate({
                position: {
                    x: (nx - 0.5) * 110,
                    y: (ny - 0.5) * -90
                },
                hue: nx
            });
        });

        window.addEventListener('mousedown', () => {
            if (!this.mouseMode) return;
            this.shapeIndex = (this.shapeIndex + 1) % shapes.length;
            const next = shapes[this.shapeIndex];
            this.onUpdate({
                explosion: 1.0,
                morph: next.morph,
                label: next.label
            });
        });
    }

    processLandmarks(res) {
        if (!res.multiHandLandmarks || !res.multiHandLandmarks[0]) return;

        const m = res.multiHandLandmarks[0];
        const position = {
            x: (m[8].x - 0.5) * -130,
            y: (m[8].y - 0.5) * -110
        };

        const pinch = Math.hypot(m[4].x - m[8].x, m[4].y - m[8].y);
        const isUp = (i) => m[i].y < m[i - 2].y;
        const ups = [8, 12, 16, 20].filter(isUp).length;

        let morph = null;
        let explosion = null;
        let label = '';

        if (pinch < 0.04) {
            morph = [0, 1, 0, 0];
            label = 'HEART STABILIZED';
        } else if (ups === 0) {
            explosion = 1.0;
            label = 'ENERGY BLAST';
        } else if (ups === 2) {
            morph = [0, 0, 1, 0];
            label = 'SATURN RINGS';
        } else if (ups === 3) {
            morph = [0, 0, 0, 1];
            label = 'STAR ALIGNMENT';
        } else {
            morph = [1, 0, 0, 0];
            label = 'NEBULA SPHERE';
        }

        if (Math.abs(m[4].x - this.hue) > 0.08) {
            this.hue = m[4].x;
        }

        this.onUpdate({ position, morph, explosion, hue: this.hue, label });
    }
}
