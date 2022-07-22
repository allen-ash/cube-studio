import * as THREE from 'three';
import React, { useEffect } from 'react';
import ThreeTool from '../ThreeTool';
// @ts-ignore
import vShaderWave from './vShaderWave.glsl'
// @ts-ignore
import fShaderWave from './fShaderWave.glsl'

function crateShaderMaterial(lightDir: THREE.Vector3, amLightIntensity = 0.3) {
	const material = new THREE.ShaderMaterial({
		uniforms: {
			time: {
				value: 0,
			},
			color: {
				value: new THREE.Color(0x1672fa),
				// value: new THREE.Color('#ffd700'),
			},
			clightDir: {
				value: lightDir,
			},
			amLightIntensity: {
				value: amLightIntensity,
			},
			amLightColor: {
				value: new THREE.Color(0xffffff),
			},
		},
		vertexShader: vShaderWave,
		fragmentShader: fShaderWave,
		depthTest: true,
		transparent: true,
	});
	return material;
}

function makePoints(n = 1, m = 1, l = 1) {
	const pointPos: THREE.Vector3[] = [];
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < m; j++) {
			for (let k = 0; k < l; k++) {
				pointPos.push(new THREE.Vector3(i * 2, j * 2, k * 2));
			}
		}
	}
	const geometry = new THREE.BufferGeometry();
	geometry.setFromPoints(pointPos);
	return geometry;
}

function main() {
	const threetool = new ThreeTool({
		canvas: document.getElementById('canvasFrameWave') as HTMLCanvasElement,
		container: document.getElementById('canvasWrapWave') as HTMLCanvasElement,
		mode: 'pro',
	});
	const axesHelper = new THREE.AxesHelper(threetool.canvas.clientHeight);
	// threetool.scene.add(axesHelper);

	const geometry = makePoints(100, 1, 50);

	const material = crateShaderMaterial(threetool.directionalLight.position.normalize());

	const points = new THREE.Points(geometry, material);

	threetool.scene.add(points);

	threetool.camera.position.set(500, 180, 300);
	threetool.controls.target.set(400, 0, 0)
	threetool.controls.update()

	// const geometry = new THREE.BoxGeometry(100, 100, 100);
	// const material = new THREE.MeshPhongMaterial({ color: 0x33bb77 });
	// const cube = new THREE.Mesh(geometry, material);
	// threetool.scene.add(cube);

	// cube.addEventListener('click', () => {
	// 	console.log('click');
	// });
	// cube.addEventListener('mouseenter', () => {
	// 	console.log('mouseenter');
	// });
	// cube.addEventListener('mouseleave', () => {
	// 	console.log('mouseleave');
	// });
	threetool.continuousRender((time) => {
		// console.log(time);
		material.uniforms.time.value = time;
	});
}

export default function WaveComponent() {
	useEffect(() => {
		main();
	}, []);
	return (
		<div id="canvasWrapWave" className="canvasWrap">
			<canvas id="canvasFrameWave" className="canvasFrame" />
		</div>
	);
}
