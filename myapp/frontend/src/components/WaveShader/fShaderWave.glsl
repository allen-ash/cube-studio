varying float intensity;
varying vec3 cPosition;
uniform vec3 color;
uniform float amLightIntensity;
uniform vec3 amLightColor;

void main(){
    float dis=distance(gl_PointCoord,vec2(.5,.5));
    // vec4 DiffuseColor = vec4(color,1.) * intensity;
    // vec4 AmbientColor = vec4(amLightColor,1.) * vec4(color,1.) * amLightIntensity;
    
    if(dis>.3){
        discard;
    }
    float opacity=.8;
    // float opacity=1.-smoothstep(.1,1.,dis*2.);
    // float opacity=10.1-abs(cPosition.y);
    gl_FragColor=vec4(color,opacity);
    // gl_FragColor = DiffuseColor + AmbientColor;
}
