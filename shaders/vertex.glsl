uniform float uTime;
uniform float uExplosion;
uniform vec4 uMorphs;
uniform vec3 uTarget;
uniform vec3 uColor;

attribute vec3 spherePos;
attribute vec3 heartPos;
attribute vec3 ringPos;
attribute vec3 starPos;

varying vec3 vColor;
varying float vOpacity;

void main() {
    // High-precision GPU morphing across 4 parametric targets
    vec3 pos = spherePos * uMorphs.x
             + heartPos  * uMorphs.y
             + ringPos   * uMorphs.z
             + starPos   * uMorphs.w;

    // Radial shockwave physics with sinusoidal wave distortion
    float distToCenter = length(pos);
    vec3 radialDir = distToCenter > 0.0001 ? normalize(pos) : vec3(0.0, 1.0, 0.0);
    pos += radialDir * uExplosion * (25.0 + sin(uTime * 10.0 + distToCenter) * 5.0);

    // Subtle organic ambient drift
    pos.x += sin(uTime * 2.0 + pos.y * 0.1) * 0.5;
    pos.z += cos(uTime * 2.0 + pos.x * 0.1) * 0.5;

    vec4 mvPos = modelViewMatrix * vec4(pos + uTarget, 1.0);

    // Distance-attenuated particle point size
    gl_PointSize = (8.0 + sin(uTime + distToCenter) * 2.0) * (100.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;

    vColor = uColor;
    vOpacity = clamp(1.5 / (length(mvPos.xyz) / 40.0), 0.0, 1.0);
}
