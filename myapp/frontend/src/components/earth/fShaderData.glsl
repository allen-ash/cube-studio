uniform vec3 color;
uniform float radius;
varying vec3 pos;
vec3 cusColor;
vec3 originPos;
float dis;

void main(){
    originPos.x = 0.;
    originPos.y = 0.;
    originPos.z = 0.;

    dis = distance(pos, originPos);
    cusColor.r = ((dis - radius) / radius) * 2.;
    cusColor.g = 0.;
    cusColor.b = .4;

    gl_FragColor = vec4(cusColor , 1.0);
}