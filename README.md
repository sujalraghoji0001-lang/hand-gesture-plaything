<div align="center">

# 🌌 Nebula Gesture Engine
**Real-time 20,000-particle GPU morphing engine controlled via webcam hand tracking.**

[![Three.js](https://img.shields.io/badge/Three.js-r128-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Hands-00ffff?style=for-the-badge&logo=google)](https://developers.google.com/mediapipe)
[![WebGL](https://img.shields.io/badge/WebGL-GLSL_Shaders-orange?style=for-the-badge&logo=webgl)](https://www.khronos.org/webgl/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[**Live Demo**](https://your-username.github.io/nebula-gesture-engine/) • [**Report Bug**](https://github.com/your-username/nebula-gesture-engine/issues) • [**Request Feature**](https://github.com/your-username/nebula-gesture-engine/issues)

</div>

---

## ✨ Features
- **60 FPS GPU Particle Morphing:** Smoothly interpolates **20,000 particles** across 4 parametric 3D topologies directly inside a custom GLSL Vertex Shader.
- **Zero-Latency Hand Tracking:** Powered by Google MediaPipe Hands to map 21 3D hand landmarks into spatial coordinates, color shifts, and kinetic triggers.
- **Automatic Mouse Fallback:** Works seamlessly even without a webcam—move your cursor to steer the nebula and click to cycle shapes with shockwave bursts.
- **Shockwave Physics:** Radial explosion displacement with sinusoidal wave distortion and exponential decay.
- **Zero Build Step:** Pure Vanilla ES Modules, HTML5, and GLSL—runs natively in any modern browser.

---

## 🖐️ Gesture Controls

| Gesture | Visual Action | Engine State |
| :--- | :--- | :--- |
| **Open Palm (Default)** | Morphs into a 3D Fibonacci Sphere | `NEBULA SPHERE` |
| **Pinch (Thumb + Index)** | Collapses into a Parametric Heart | `HEART STABILIZED` |
| **2 Fingers Up (Peace)** | Expands into Saturn's Planetary Rings | `SATURN RINGS` |
| **3 Fingers Up** | Aligns into a 5-Pointed Geometric Star | `STAR ALIGNMENT` |
| **Closed Fist** | Triggers a radial shockwave blast | `ENERGY BLAST` |
| **Horizontal Hand Move** | Shifts global HSL color spectrum | *Dynamic Hue* |

---

## 📁 Project Structure

```text
nebula-gesture-engine/
├── index.html          # Entry point with HUD & canvas
├── css/
│   └── style.css       # Cyberpunk HUD styling & responsive layout
├── js/
│   ├── main.js         # Three.js setup, shader loader & render loop
│   ├── geometries.js   # Procedural math (Fibonacci sphere, heart, rings, star)
│   └── gestures.js     # Hand landmark math, state machine & mouse fallback
├── shaders/
│   ├── vertex.glsl     # GPU morphing, wave distortion & explosion physics
│   └── fragment.glsl   # Radial additive glow shader
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Quick Start

Because ES Modules and `getUserMedia` require HTTP/HTTPS, serve the directory using any local web server:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/nebula-gesture-engine.git
cd nebula-gesture-engine

# 2. Start a local server (pick any one)
npx serve .
# OR using Python
python -m http.server 8000
```

Open `https://startling-panda-33c73f.netlify.app` in Chrome, Edge, or Brave and allow camera access.

---

## 🧮 Under the Hood (Math & Shaders)

Instead of updating 20,000 vertices on the CPU every frame, all four shapes are pre-computed into custom `BufferAttribute` arrays (`spherePos`, `heartPos`, `ringPos`, `starPos`) at startup.

During rendering, the **Vertex Shader** blends them via a `vec4 uMorphs` uniform:

```glsl
vec3 pos = spherePos * uMorphs.x
         + heartPos  * uMorphs.y
         + ringPos   * uMorphs.z
         + starPos   * uMorphs.w;
```

- **Sphere:** Distributed evenly using a Fibonacci lattice ($p = \arccos(-1 + \frac{2i}{N})$).
- **Heart:** Generated via parametric trigonometric curves ($x = 16\sin^3(t)$).
- **Glow:** Fragment shader computes radial distance from `gl_PointCoord` with cubic falloff (`pow(1.0 - d * 2.0, 3.0)`) and `THREE.AdditiveBlending`.

---

## 🛠️ Roadmap & Ideas for Contributors
- [ ] Add **Audio Reactivity** (Web Audio API FFT bass boost on explosion uniform)
- [ ] Add **Two-Handed Mode** (stretch/scale nebula size by distance between both hands)
- [ ] Add a **GUI Control Panel** (`lil-gui`) to tweak particle count, bloom intensity, and decay rate
- [ ] Add **DNA Double Helix** and **Torus Knot** geometries

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
