uniform sampler2D customTexture;
varying vec2 customUv;

void main(){
    vec4 texture=texture2D(customTexture,customUv);
    vec3 color=texture.rgb;
    gl_FragColor=vec4(color,.9);
    // vec3 color=vec3(texture.r,texture.g,texture.a);
    // if(texture.b<.99){
    //     color=vec3(30/225,22/225,83/225);
    // }
    // gl_FragColor=vec4(color,.7);
}