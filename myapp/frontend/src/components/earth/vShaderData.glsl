varying vec3 pos;
uniform float val;
attribute vec3 position2;
varying vec3 cusPos;

void main(){
    pos = position;
    cusPos.x = position.x * val + position2.x * (1.-val);
	cusPos.y = position.y * val + position2.y * (1.-val);
	cusPos.z = position.z * val + position2.z * (1.-val);

    gl_PointSize = 1.;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(cusPos, 1.0);
}