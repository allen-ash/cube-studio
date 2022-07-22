// import "../App.css";
import * as THREE from "three";
import { AdditiveBlending, Color, CustomBlending, Material, Matrix4, Mesh, MeshBasicMaterial, MultiplyBlending, NormalBlending, ShaderMaterial, SubtractiveBlending, Vector3 } from "three";
import React, { useEffect } from "react";
import TWEEN from "@tweenjs/tween.js";
import ThreeTool from "../ThreeTool";
// import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import data from "./data";

// @ts-ignore
import vShaderEarth from './vShaderEarth.glsl'
// @ts-ignore
import fShaderEarth from './fShaderEarth.glsl'
// @ts-ignore
import vShaderData from './vShaderData.glsl'
// @ts-ignore
import fShaderData from './fShaderData.glsl'

const EarthRadius = 200

async function crateMapShaderMaterial(): Promise<ShaderMaterial> {
  const loadTexture = () =>
    new Promise((resolve, rejest) => {
      new THREE.TextureLoader().load(
        `${process.env.PUBLIC_URL}/assets/worldMap.jpg`,
        (texture: THREE.Texture) => resolve(texture),
        () => { },
        (event: ErrorEvent) => rejest(event)
      );
    }).catch(err => {
      console.log(err);
    });
  const texture = await loadTexture();
  //   const texture = new THREE.TextureLoader().load("/assets/world.jpg");
  const material = new THREE.ShaderMaterial({
    uniforms: {
      customTexture: {
        value: texture,
      },
      color: {
        value: new THREE.Color(0xd2d0dd),
      },
    },
    vertexShader: vShaderEarth,
    fragmentShader: fShaderEarth,
    depthTest: true,
    // transparent: true,
    // opacity: 0.5,
    // wireframe: true,
  });
  return material;
}

async function crateMapOutShaderMaterial(): Promise<MeshBasicMaterial> {
  const loadTexture = () =>
    new Promise((resolve, rejest) => {
      new THREE.TextureLoader().load(
        `${process.env.PUBLIC_URL}/assets/dotsMap.jpg`,
        (texture: THREE.Texture) => resolve(texture),
        () => { },
        (event: ErrorEvent) => rejest(event)
      );
    }).catch(err => {
      console.log(err);
    });
  const texture = await loadTexture();
    // const texture = new THREE.TextureLoader().load("/assets/world.jpg");
  const material = new THREE.MeshBasicMaterial({
    // uniforms: {
    //   customTexture: {
    //     value: texture,
    //   },
    //   color: {
    //     value: new THREE.Color(0xd2d0dd),
    //   },
    // },
    // vertexShader: vShaderEarth,
    // fragmentShader: fShaderEarth,
    color: new THREE.Color(0x1e1653),
    depthTest: true,
    transparent: true,
    opacity: 0.5,
    wireframe: true,
    // wireframeLinewidth: 100,
    blending: AdditiveBlending
  });
  return material;
}

function crateDataShaderMaterial() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: {
        value: new THREE.Color(0xd2d0dd),
      },
      radius: {
        value: EarthRadius
      },
      val: { value: 0 },
    },
    vertexShader: vShaderData,
    fragmentShader: fShaderData,
    depthTest: true,
    transparent: true,
    // opacity: 0.5,
    // wireframe: true,
  });
  // 给着色器提供周期变化
  const pos = { val: 0 };
  const tween = new TWEEN.Tween(pos)
    .to({ val: 1 }, 2000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .delay(500)
    .onUpdate(function ({ val }) {
      material.uniforms.val.value = val;
    });
  const tweenBack = new TWEEN.Tween(pos)
    .to({ val: 0 }, 500)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .delay(5000)
    .onUpdate(function ({ val }) {
      material.uniforms.val.value = val;
    });
  tween.chain(tweenBack);
  tweenBack.chain(tween);
  tween.start();
  return material;
}

async function makeSphereInstance(
  radius: number = 100,
  pos = { x: 0, y: 0, z: 0 }
) {
  const ShaderMaterial = await crateMapShaderMaterial();
  const geometry = new THREE.SphereGeometry(radius, 64, 64);
  const cube = new THREE.Mesh(geometry, ShaderMaterial);
  cube.position.set(pos.x, pos.y, pos.z);
  return cube;
}

async function makeSphereOutInstance(
  radius: number = 100,
  pos = { x: 0, y: 0, z: 0 }
) {
  const ShaderMaterial = await crateMapOutShaderMaterial();
  const geometry = new THREE.SphereGeometry(radius, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
  const cube = new THREE.Mesh(geometry, ShaderMaterial);
  cube.position.set(pos.x, pos.y, pos.z);
  return cube;
}

function makeBox(color: number): Mesh {
  const boxWidth = 10;
  const boxHeight = 10;
  const boxDepth = 10;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  const material = new THREE.MeshBasicMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  return cube;
}

// 经纬度转成球体坐标
function convertLatLngToSphereCoords(
  latitude: number,
  longitude: number,
  radius: number
) {
  const phi = (latitude * Math.PI) / 180;
  const theta = ((longitude - 180) * Math.PI) / 180;
  const x = -(radius + -1) * Math.cos(phi) * Math.cos(theta);
  const y = (radius + -1) * Math.sin(phi);
  const z = (radius + -1) * Math.cos(phi) * Math.sin(theta);
  return {
    x,
    y,
    z,
    phi,
    theta,
  };
}

// 球体指示器
function createLatLonGuide(
  radius: number
): {
  lonGuide: THREE.Object3D;
  latGuide: THREE.Object3D;
  positionGuide: THREE.Object3D;
  scaleGuide: THREE.Object3D;
} {
  const lonGuide = new THREE.Object3D();
  const latGuide = new THREE.Object3D();
  const positionGuide = new THREE.Object3D();
  const scaleGuide = new THREE.Object3D();
  positionGuide.position.z = radius;
  scaleGuide.position.z = 0.5;
  lonGuide.add(latGuide);
  latGuide.add(positionGuide);
  positionGuide.add(scaleGuide);
  return {
    lonGuide,
    latGuide,
    positionGuide,
    scaleGuide,
  };
}

async function main() {
  const threetool = new ThreeTool({
    canvas: document.getElementById("canvasFrameEarth") as HTMLCanvasElement,
    container: document.getElementById("canvasWrapEarth") as HTMLCanvasElement,
    mode: "pro",
  });
  const axesHelper = new THREE.AxesHelper(threetool.canvas.clientHeight);
  // threetool.scene.add(axesHelper);

  const earth = await makeSphereInstance(EarthRadius);
  // const earthOut = await makeSphereOutInstance(270)
  // threetool.scene.add(earth);

  const meshGroup = new THREE.Group();
  const meshGroupOut = new THREE.Group();
  meshGroup.add(earth);
  // meshGroupOut.add(earthOut)

  threetool.scene.add(meshGroup);
  // threetool.scene.add(meshGroupOut)

  const maxValue = Math.max(...data.map((item) => +item.value));
  const minValue = Math.min(...data.map((item) => +item.value));
  const range = maxValue - minValue;

  const geometryList: THREE.BoxBufferGeometry[] = [];

  data.forEach(({ lat, lng, value }) => {
    const { x, y, z, phi, theta } = convertLatLngToSphereCoords(
      +lat,
      +lng,
      EarthRadius
    );
    // 最重要是这个几何体的z轴位置，然后应用位移矩阵时，将z轴位移一半，相当于将中心点位移到左/右端
    // 设置为1的话刚刚好，不影响z轴的放大比例
    const geometry = new THREE.BoxBufferGeometry(2, 2, 1);
    // 区间[0-1]
    const range01 = (value - minValue) / range;
    const { latGuide, lonGuide, positionGuide, scaleGuide } = createLatLonGuide(
      EarthRadius
    );

    // 经度修正：与本初子午线相差90deg
    const lonFudge = Math.PI * 0.5;
    latGuide.rotation.x = -phi;
    lonGuide.rotation.y = theta - lonFudge;

    const cubeHeight = range01 * 50;
    positionGuide.scale.set(1, 1, cubeHeight);
    scaleGuide.updateWorldMatrix(true, false);

    const position2 = new Float32Array(
      geometry.attributes.position.array.length
    );
    for (let i = 0; i < position2.length; i = i + 3) {
      position2[i] = x;
      position2[i + 1] = y;
      position2[i + 2] = z;
    }
    geometry.setAttribute("position2", new THREE.BufferAttribute(position2, 3));
    geometry.applyMatrix4(scaleGuide.matrixWorld);

    geometryList.push(geometry);
  });

  const material = crateDataShaderMaterial();
  // const mergeGemotry = BufferGeometryUtils.mergeBufferGeometries(
  //   geometryList,
  //   false
  // );
  // const mesh = new Mesh(mergeGemotry, material);
  // meshGroup.add(mesh);

  threetool.camera.position.set(-250, 250, 250);
  threetool.controls.target.set(-200, 50, 0)
  threetool.controls.update()

  threetool.scene.background = new THREE.Color(0x666666)

  threetool.bloomRender(() => {
    meshGroup.rotateY(Math.PI / 1800);
    // threetool.renderer.setClearColor(0x000000, 0)
    // meshGroupOut.rotateY(-Math.PI / 1800);
    TWEEN.update();
  });
}

export default function Earth() {
  useEffect(() => {
    main();
  }, []);
  return (
    <div id="canvasWrapEarth" className="canvasWrap">
      <canvas id="canvasFrameEarth" className="canvasFrame" />
    </div>
  );
}
