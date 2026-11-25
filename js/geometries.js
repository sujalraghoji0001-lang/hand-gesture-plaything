/**
 * Generates pre-computed BufferAttributes for 4 parametric 3D topologies.
 * @param {number} count Number of particles
 * @returns {THREE.BufferGeometry}
 */
export function createParticleGeometry(count = 20000) {
    const geo = new THREE.BufferGeometry();
    const sArr = [];
    const hArr = [];
    const rArr = [];
    const stArr = [];
    const bArr = [];

    for (let i = 0; i < count; i++) {
        // 1. Fibonacci Sphere Lattice
        const p = Math.acos(-1 + (2 * i) / count);
        const t = Math.sqrt(count * Math.PI) * p;
        sArr.push(
            18 * Math.cos(t) * Math.sin(p),
            18 * Math.sin(t) * Math.sin(p),
            18 * Math.cos(p)
        );

        // 2. Parametric Heart Curve
        const a = Math.random() * Math.PI * 2;
        hArr.push(
            16 * Math.pow(Math.sin(a), 3) * 0.8,
            (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * 0.8,
            (Math.random() - 0.5) * 5
        );

        // 3. Saturn Planetary Rings
        const ang = Math.random() * Math.PI * 2;
        const rad = 22 + (Math.random() - 0.5) * 6;
        rArr.push(
            Math.cos(ang) * rad,
            Math.sin(ang) * rad,
            (Math.random() - 0.5) * 2
        );

        // 4. 5-Pointed Geometric Star
        const sa = Math.random() * Math.PI * 2;
        const sr = 18 * (Math.abs(Math.cos(sa * 2.5)) + 0.2);
        stArr.push(
            Math.cos(sa) * sr,
            Math.sin(sa) * sr,
            (Math.random() - 0.5) * 4
        );

        bArr.push(0, 0, 0);
    }

    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(bArr), 3));
    geo.setAttribute('spherePos', new THREE.BufferAttribute(new Float32Array(sArr), 3));
    geo.setAttribute('heartPos', new THREE.BufferAttribute(new Float32Array(hArr), 3));
    geo.setAttribute('ringPos', new THREE.BufferAttribute(new Float32Array(rArr), 3));
    geo.setAttribute('starPos', new THREE.BufferAttribute(new Float32Array(stArr), 3));

    return geo;
}
