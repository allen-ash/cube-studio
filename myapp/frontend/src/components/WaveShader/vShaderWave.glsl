varying float intensity;
varying vec3 cPosition;
uniform vec3 clightDir;
uniform float time;

float rand(float x){
    float y=fract(sin(x)*10000.);
    return y;
}

void main(){
    cPosition.x=position.x*5.;
    cPosition.y=cos((position.z+position.x+time*1.)*.3)*5.+cos((position.z+position.x+time*10.)*.2)*5.;
    // cPosition.y=position.y*5.;
    cPosition.z=position.z*5.;
    
    intensity=dot(clightDir,normalize(normal));
    // gl_PointSize=(8.+cPosition.y/2.)-2.5*(1.-cPosition.z/1000.);
    gl_PointSize=(5.+cPosition.y/2.)-5.*(1.-(cPosition.z)/180.);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(cPosition,1.);
}
