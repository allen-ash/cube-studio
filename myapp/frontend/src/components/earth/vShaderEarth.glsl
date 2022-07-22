varying vec2 customUv;

void main(){
    gl_PointSize = 4.;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    customUv = uv;
}