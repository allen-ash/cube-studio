/*
 * code by flyteng1874
 * https://juejin.cn/user/1873223545795005
 */

import * as THREE from 'three';
import { AmbientLight, Color, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// import { UnrealBloomPass } from "./TransparentBackgroundFixedUnrealBloomPass"
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

const throttle = (fun: Function, context?: any, time = 0): any => {
	let flag = true;
	return (...args: any): void => {
		if (flag) {
			fun.apply(context, [...args]);
			flag = false;
			setTimeout(() => {
				flag = true;
			}, time);
		}
	};
};

export default class ThreeTool {
	// 必须参数
	// 相机
	public camera: PerspectiveCamera;
	// 方向光
	public directionalLight: DirectionalLight;
	// 环境光
	public ambientLight: AmbientLight;
	// 场景
	public scene: Scene;
	// 光栅化
	public renderer: WebGLRenderer;
	// 光线追踪类
	public raycaster = new THREE.Raycaster();
	// 画布
	public canvas: HTMLCanvasElement;
	// 画布容器
	public container: HTMLElement;
	// 相机轨道控制
	public controls: OrbitControls;
	// 可将dom转化为object3d对象
	public css2drenderer: CSS2DRenderer;

	// 可选参数
	// 性能监控
	public stats?: Stats;
	// 事件缓存
	public _HoverEventCacheObj = new Map<string | number, THREE.Object3D>();
	public _ClickEventCacheObj = new Map<string | number, THREE.Object3D>();

	public throttleTriggerByPointer = throttle(this.triggerByPointer, this);

	private mode: 'dev' | 'pro' = 'dev';

	constructor(threeToolParams: {
		canvas: HTMLCanvasElement;
		container: HTMLElement;
		mode: 'dev' | 'pro';
		clearColor?: Color;
	}) {
		const { canvas, mode, container, clearColor } = threeToolParams;
		this.mode = mode;
		this.canvas = canvas;
		this.container = container;
		this.camera = this.initCamera();
		this.scene = this.initScene();
		this.directionalLight = this.initDirectionalLight();
		this.ambientLight = this.initAmbientLight();
		this.renderer = this.initRenderer({
			canvas,
			clearColor,
		});
		this.css2drenderer = this.initCSS2DRenderer(this.container);
		this.controls = this.initOrbitControls();

		// 初始化交互事件
		this.initEvent();
		this.scene.add(this.directionalLight);
		this.scene.add(this.ambientLight);

		this.renderer.render(this.scene, this.camera);
		if (mode === 'dev') {
			window.THREE = THREE;
			this.stats = this.initStats(container);
		}
	}

	public initCamera(cameraParams = { fov: 75, aspect: 2, near: 0.1, far: 2000 }): PerspectiveCamera {
		const { aspect, near, far } = cameraParams;
		const position = new THREE.Vector3(100, 100, 600);
		const Rag2Deg = 360 / (Math.PI * 2);
		// 反三角函数返回弧度值，视角高度为画布高度，为了与屏幕像素单位等同
		const fovRad = 2 * Math.atan(this.canvas.clientHeight / 2 / position.z);
		// 转为角度值
		const fovDeg = fovRad * Rag2Deg;
		const camera = new THREE.PerspectiveCamera(fovDeg, aspect, near, far);
		camera.position.set(position.x, position.y, position.z);
		return camera;
	}

	public initDirectionalLight(color: Color = new Color(0xffffff), intensity = 1): DirectionalLight {
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(1000, 1000, 1000);
		return light;
	}

	public initAmbientLight(color: Color = new Color(0xffffff), intensity = 0.3) {
		const light = new THREE.AmbientLight(color, intensity);
		return light;
	}

	public initScene(): Scene {
		const scene = new THREE.Scene();
		return scene;
	}

	public initRenderer(rendererParams: { canvas: HTMLCanvasElement; clearColor?: Color, opacity?: number }): WebGLRenderer {
		const { canvas, clearColor = new Color(0xff0000), opacity = 0 } = rendererParams;
		const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
		console.log(clearColor, opacity)
		renderer.setClearColor(clearColor, opacity);
		return renderer;
	}

	public initCSS2DRenderer(container: HTMLElement): CSS2DRenderer {
		const css2drenderer = new CSS2DRenderer();
		css2drenderer.domElement.style.position = 'absolute';
		css2drenderer.domElement.style.top = '0';
		// css2drenderer.domElement.style.display = 'none';
		container.appendChild(css2drenderer.domElement);
		return css2drenderer;
	}

	public initSkybox(url: string) {
		const loader = new THREE.TextureLoader();
		const texture = loader.load(
			// "https://threejsfundamentals.org/threejs/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg",
			//   "/assets/sky.jpg",
			url,
			() => {
				const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
				rt.fromEquirectangularTexture(this.renderer, texture);
				// this.scene.background = rt.texture;
				this.scene.background = texture;
			},
		);
	}

	public initStats(container: HTMLElement): Stats {
		const stats = new Stats();
		// 将性能监控屏区显示在左上角
		stats.dom.style.position = 'absolute';
		stats.dom.style.bottom = '0px';
		stats.dom.style.zIndex = '100';
		container.appendChild(stats.dom);
		return stats;
	}

	public initOrbitControls(isContinue = true): OrbitControls {
		let controls;
		if (isContinue) {
			// https://blog.csdn.net/wclwksn2019/article/details/105761609
			controls = new OrbitControls(this.camera, this.css2drenderer.domElement);
		} else {
			controls = new OrbitControls(this.camera, this.renderer.domElement);
		}
		controls.target.set(0, 0, 0);
		return controls;
	}

	public addGobalMouseListener(
		type: 'hover' | 'click',
		callbackTriger: (object: THREE.Object3D) => void,
		callbackBack: (object: THREE.Object3D) => void,
	) {
		this.container.addEventListener('pointermove', (event) =>
			this.throttleTriggerByPointer(event, type, callbackTriger, callbackBack),
		);
		this.container.addEventListener('click', (event) =>
			this.throttleTriggerByPointer(event, type, callbackTriger, callbackBack),
		);
	}

	public initEvent() {
		// hover
		this.container.addEventListener('pointermove', (event) => this.throttleTriggerByPointer(event, 'hover'));
		this.container.addEventListener('click', (event) => this.throttleTriggerByPointer(event, 'click'));
	}

	public triggerByPointer(
		event: PointerEvent | MouseEvent,
		type: 'hover' | 'click',
		callbackTriger?: (obj: THREE.Object3D) => void,
		callbackBack?: (obj: THREE.Object3D) => void,
	) {
		// console.log(this._HoverEventCacheObj);
		const res = this.getObject3D(event);
		const object3D = res?.object;
		if (object3D) {
			// 触发相关事件
			if (type === 'hover') {
				// console.log(object3D.id);
				object3D.dispatchEvent({ type: 'mouseenter', ...res });
				let cacheObj = object3D;
				while (cacheObj.parent) {
					cacheObj = cacheObj.parent;
					cacheObj.dispatchEvent({ type: 'mouseenter', ...res });
				}
				this._HoverEventCacheObj.set(object3D.id, object3D);
			} else {
				object3D.dispatchEvent({ type, ...res });
				let cacheObj = object3D;
				while (cacheObj.parent) {
					cacheObj = cacheObj.parent;
					cacheObj.dispatchEvent({ type, ...res });
				}
				this._ClickEventCacheObj.set(object3D.id, object3D);
			}
			callbackTriger && callbackTriger(object3D);
		} else {
			if (type === 'hover') {
				this._HoverEventCacheObj.forEach((item) => {
					item.dispatchEvent({ type: 'mouseleave', ...res });
					let cacheObj = item;
					while (cacheObj.parent) {
						cacheObj = cacheObj.parent;
						cacheObj.dispatchEvent({ type: 'mouseleave', ...res });
					}
					callbackBack && callbackBack(item);
				});
				this._HoverEventCacheObj.clear();
			}

			if (type === 'click') {
				this._ClickEventCacheObj.forEach((item) => {
					// 点击空白事件
					item.dispatchEvent({ type: 'clickSpace', ...res });
					let cacheObj = item;
					while (cacheObj.parent) {
						cacheObj = cacheObj.parent;
						cacheObj.dispatchEvent({ type: 'clickSpace', ...res });
					}
					callbackBack && callbackBack(item);
				});
				this._ClickEventCacheObj.clear();
			}
		}
	}

	public getObject3D(event: PointerEvent | MouseEvent): THREE.Intersection | null {
		const pointer = new THREE.Vector2();
		pointer.x = (event.offsetX / this.container.clientWidth) * 2 - 1;
		pointer.y = -(event.offsetY / this.container.clientHeight) * 2 + 1;
		this.raycaster.setFromCamera(pointer, this.camera);
		const intersects = this.raycaster.intersectObject(this.scene, true);
		if (intersects.length > 0) {
			const res = intersects.filter((item) => {
				return item && item.object;
			})[0];
			if (res && res.object) {
				return res;
			}
			return null;
		} else {
			return null;
		}
	}

	public resizeRendererToDisplaySize(renderer: WebGLRenderer, isUseScreenRatio = true) {
		const canvas = renderer.domElement;
		// 设备物理像素与设备独立像素的比例，即设备独立像素*devicePixelRatio=设备真实的物理物理像素
		const pixelRatio = isUseScreenRatio ? window.devicePixelRatio : 1;
		// 以屏幕的分辨率渲染
		const width = (canvas.clientWidth * pixelRatio) | 0;
		const height = (canvas.clientHeight * pixelRatio) | 0;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
			renderer.setSize(width, height, false);
		}
		return needResize;
	}

	// 连续渲染模式
	public continuousRender(callback?: (time: number) => void) {
		const render = (time: number) => {
			if (this.resizeRendererToDisplaySize(this.renderer)) {
				const canvas = this.renderer.domElement;
				this.css2drenderer.setSize(canvas.clientWidth, canvas.clientHeight);
				this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
				this.camera.updateProjectionMatrix();
			}
			this.css2drenderer.render(this.scene, this.camera);
			this.renderer.render(this.scene, this.camera);
			// 时间单位规整到秒
			const t = time * 0.001;
			callback && callback(t);
			if (this.mode === 'dev') {
				this.stats?.update();
			}
			requestAnimationFrame(render);
		};
		render(0);
	}

	// 辉光渲染模式
	/**
	 * UnrealBloomPass的参数
	 * 1: 辉光所覆盖的场景大小
	 * 2：辉光的强度
	 * 3：辉光散发的半径
	 * 4：辉光的阈值（场景中的光强大于该值就会产生辉光效果）
	 */
	public bloomRender(callback?: (time: number) => void) {
		const renderScene = new RenderPass(this.scene, this.camera);
		// Bloom通道创建
		const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 3, 5, 1);
		bloomPass.renderToScreen = true;
		bloomPass.strength = 0.5;
		bloomPass.radius = 0.3;
		bloomPass.threshold = 0.2;

		const composer = new EffectComposer(this.renderer);
		composer.setSize(window.innerWidth, window.innerHeight);
		composer.addPass(renderScene);
		// 眩光通道bloomPass插入到composer
		composer.addPass(bloomPass);

		const render = (time: number) => {
			if (this.resizeRendererToDisplaySize(this.renderer)) {
				const canvas = this.renderer.domElement;
				this.css2drenderer.setSize(canvas.clientWidth, canvas.clientHeight);
				this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
				this.camera.updateProjectionMatrix();
			}
			this.css2drenderer.render(this.scene, this.camera);
			composer.render();
			// this.renderer.render(this.scene, this.camera);
			// 时间单位规整到秒
			const t = time * 0.001;
			callback && callback(t);
			if (this.mode === 'dev') {
				this.stats?.update();
			}
			requestAnimationFrame(render);
		};
		render(0);
	}

	// 按需渲染模式:一般用来查看静态模型
	public ondemandRender(callback?: () => void) {
		this.initOrbitControls(false);
		let renderRequested = false;
		const render = () => {
			renderRequested = false;
			if (this.resizeRendererToDisplaySize(this.renderer)) {
				const canvas = this.renderer.domElement;
				this.css2drenderer.setSize(canvas.clientWidth, canvas.clientHeight);
				this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
				this.camera.updateProjectionMatrix();
			}
			this.controls.enableDamping = true;
			this.controls.update();
			if (this.mode === 'dev') {
				this.stats?.update();
			}
			callback && callback();
			this.renderer.render(this.scene, this.camera);
		};
		render();
		const requestRenderIfNotRequested = () => {
			if (!renderRequested) {
				renderRequested = true;
				requestAnimationFrame(render);
			}
		};
		this.controls.addEventListener('change', requestRenderIfNotRequested);
		window.addEventListener('resize', requestRenderIfNotRequested);
	}

	/**
	 * Converts an HSL color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes h, s, and l are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 * https://qastack.cn/programming/2353211/hsl-to-rgb-color-conversion
	 *
	 * @param   {number}  h       The hue
	 * @param   {number}  s       The saturation
	 * @param   {number}  l       The lightness
	 * @return  {Array}           The RGB representation
	 */
	public hslToRgb(h: number, s: number, l: number) {
		let r;
		let g;
		let b;

		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			let hue2rgb = function hue2rgb(p: number, q: number, t: number) {
				// eslint-disable-next-line no-param-reassign
				if (t < 0) t = t + 1;
				// eslint-disable-next-line no-param-reassign
				if (t > 1) t = t - 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};

			let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			let p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

	/**
	 * Converts an RGB color value to HSL. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes r, g, and b are contained in the set [0, 255] and
	 * returns h, s, and l in the set [0, 1].
	 *
	 * @param   {number}  r       The red color value
	 * @param   {number}  g       The green color value
	 * @param   {number}  b       The blue color value
	 * @return  {Array}           The HSL representation
	 */
	public rgbToHsl(r: number, g: number, b: number) {
		// eslint-disable-next-line no-param-reassign
		r = r / 255;
		// eslint-disable-next-line no-param-reassign
		g = g / 255;
		// eslint-disable-next-line no-param-reassign
		b = b / 255;
		let max = Math.max(r, g, b);
		let min = Math.min(r, g, b);
		let h;
		let s;
		let l = (max + min) / 2;

		if (max === min) {
			h = s = 0; // achromatic
		} else {
			let d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			h = (h as number) / 6;
		}
	}
}
