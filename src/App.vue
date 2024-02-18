<template>
  <div id="my_three"></div>
</template>

<script setup>
// const { proxy } = getCurrentInstance();
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted } from "vue";
import * as THREE from "three";
import * as dat from "dat.gui";

// const THREE = proxy.$THREE; // 挂载原型

// 创建立方体
const createCube = (scene) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = 0;
  cube.position.y = 0;
  cube.position.z = 0;
  scene.add(cube);
  return cube;
};

// 创建坐标轴
const createHelper = (scene) => {
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);
};

// controls.addEventListener("change", () => {
//   renderer.render(scene, camera);
// });

// 控制轨道控制器移动摄像机，也可以监听change事件
const renderLoop = (controls, renderer, scene, camera, cube) => {
  // cube.rotation.y += 0.1; 旋转
  renderer.render(scene, camera);
  // 必须手动update
  controls.update();
  // 根据计算机浏览器刷新帧率，递归调用
  requestAnimationFrame(() =>
    renderLoop(controls, renderer, scene, camera, cube),
  );
};

// 适配浏览器窗口变化
const resizeRender = (renderer, camera) => {
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // 更新视锥体空间
  });
};

// 创建图形界面工具
const createGUI = (cube, controls) => {
  const gui = new dat.GUI();
  gui.add(document, "title");
  gui.add(cube, "visible");
  gui.add(controls, "reset"); // 重制轨道控制器初始角度
  // 控制颜色改变
  const colorObj = {
    col: `#${cube.material.color.getHexString()}`, // 获取16进制字符串
  };
  gui.addColor(colorObj, "col").onChange((val) => {
    cube.material.color = new THREE.Color(val);
  });
};

onMounted(() => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true }); // 抗锯齿
  // 设置画布大小
  renderer.setSize(window.innerWidth, window.innerHeight);

  // camera.position.x = 5; set可以一次性设置3轴位置
  camera.position.set(5, 5, 5);

  createHelper(scene);

  // 创建轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 阻尼效果
  // controls.autoRotate = true; // 自动旋转
  // 垂直角度范围控制
  controls.maxPolarAngle = Math.PI;
  controls.minPolarAngle = 0;
  //水平角度范围控制
  controls.maxAzimuthAngle = 1.5 * Math.PI; // 摄像机左右翻转最大距离
  // controls.minAzimuthAngle = 0.5 * Math.PI; // 摄像机左右翻转最小距离
  // 摄像机移动范围控制
  controls.minDistance = 5; // 可移动最近距离
  controls.maxDistance = 100; // 可移动最远距离

  const cube = createCube(scene);
  createGUI(cube, controls);

  // 传入场景摄像机，渲染画面
  document.getElementById("my_three").appendChild(renderer.domElement);
  // 实现控制相机

  renderLoop(controls, renderer, scene, camera, cube);

  // 渲染方法不放在最后会出现首次渲染不加载的问题
  // renderer.render(scene, camera);

  resizeRender(renderer, camera);
});
</script>

<style lang="scss" scoped></style>
