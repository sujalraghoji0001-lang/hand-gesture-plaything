varying vec3 vColor;
varying float vOpacity;

void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;

    // Cubic radial falloff for soft additive glow
    float glow = pow(1.0 - d * 2.0, 3.0);
    gl_FragColor = vec4(vColor * (glow + 0.5), glow * vOpacity);
}
