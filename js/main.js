import { createParticleGeometry } from './geometries.js';
import { GestureController } from './gestures.js';

const PARTICLE_COUNT = 20000;

let scene, camera, renderer, material;
const lerpPos = new THREE.Vector3();
const targetMorph = new THREE.Vector4(1, 0, 0, 0);
let explosion = 0;
let hue = 0.5;

async function loadShader(url) {
    const response = await fetch(url);
    return await response.text();
}

async function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 70;

    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(renderer.domElement);

    const [vertexShader, fragmentShader] = await Promise.all([
        loadShader('./shaders/vertex.glsl'),
        loadShader('./shaders/fragment.glsl')
    ]);

    const geometry = createParticleGeometry(PARTICLE_COUNT);

    material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uExplosion: { value: 0 },
            uTarget: { value: new THREE.Vector3() },
            uColor: { value: new THREE.Color(0x00ffff) },
            uMorphs: { value: targetMorph }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    scene.add(new THREE.Points(geometry, material));

    const gestureController = new GestureController({
        videoElement: document.getElementById('v-preview'),
        onCameraError: () => {
            document.getElementById('status-banner').classList.remove('hidden');
        },
        onUpdate: ({ position, morph, explosion: burst, hue: nextHue, label }) => {
            if (position) {
                lerpPos.x = position.x;
                lerpPos.y = position.y;
            }
            if (morph) {
                targetMorph.set(...morph);
            }
            if (typeof burst === 'number') {
                explosion = burst;
            }
            if (typeof nextHue === 'number') {
                hue = nextHue;
            }
            if (label) {
                document.getElementById('gesture-name').innerText = label;
            }
        }
    });

    gestureController.start();
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    material.uniforms.uTime.value += 0.03;
    explosion *= 0.94;
    material.uniforms.uExplosion.value = explosion;
    material.uniforms.uTarget.value.lerp(lerpPos, 0.15);
    material.uniforms.uMorphs.value.lerp(targetMorph, 0.1);

    const targetColor = new THREE.Color().setHSL(hue, 0.8, 0.6);
    material.uniforms.uColor.value.lerp(targetColor, 0.1);

    document.getElementById('power-bar').style.width = `${explosion * 100}%`;
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
