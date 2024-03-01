<template>
  <div id="my_three"></div>
</template>

<script setup>
// const { proxy } = getCurrentInstance();
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted } from "vue";
import * as THREE from "three";
import * as dat from "dat.gui";
import {
  useCreateControls,
  useCreateHelper,
  useCreateStats,
  useResizeRender,
} from "./hooks/index.js";
import scene from "three/addons/offscreen/scene.js";

// 创建立方体
const createCube = (scene) => {
  let cube, group;
  group = new THREE.Group(); // 创建分组
  // **************彩色立方体**********************
  // const colorArr = ["red", "green", "blue", "pink", "orange", "write"];
  // const materialArr = colorArr.map(
  //   (item) => new THREE.MeshBasicMaterial({ color: item }),
  // );
  // const geometry = new THREE.BoxGeometry(1, 1, 1);
  // cube = new THREE.Mesh(geometry, cubeInfoArr);
  // **********************************************

  // **************基础绿色立方体**********************
  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  // const geometry = new THREE.BoxGeometry(1, 1, 1);
  // cube = new THREE.Mesh(geometry, material);
  // cube.position.x = 0;
  // cube.position.y = 0;
  // cube.position.z = 0;
  // **********************************************

  // *****************好几个立方体********************
  const cubeInfoArr = [];
  for (let i = 0; i < 5; i++) {
    cubeInfoArr.push({
      color: `rgb(${Math.floor(Math.random() * (255 + 1))},${Math.floor(Math.random() * (255 + 1))},${Math.floor(Math.random() * (255 + 1))})`,
      width: Math.floor(Math.random() * (3 - 1 + 1) + 1),
      height: Math.floor(Math.random() * (3 - 1 + 1) + 1),
      deep: Math.floor(Math.random() * (3 - 1 + 1) + 1),
      x: Math.floor(Math.random() * (5 - -5 + 1) + -5),
      y: Math.floor(Math.random() * (5 - -5 + 1) + -5),
      z: Math.floor(Math.random() * (5 - -5 + 1) + -5),
    });
  }
  cubeInfoArr.map((item) => {
    const { color, width, height, deep, x, y, z } = item;
    const geometry = new THREE.BoxGeometry(width, height, deep);
    const material = new THREE.MeshBasicMaterial({ color });
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    // cube.name = "cu";
    group.add(cube);
    // scene.add(cube);
  });
  scene.add(group);
  // **********************************************

  return { cube, group };
};

// 创建其他几何体
const createGeometry = (scene) => {
  const circleGeometry = new THREE.CircleGeometry(1, 32); // 圆
  const planeGeometry = new THREE.PlaneGeometry(2, 2); // 方片
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 16); // 球
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide, // 双面渲染
  });
  const circle = new THREE.Mesh(circleGeometry, material);
  const plane = new THREE.Mesh(planeGeometry, material);
  plane.position.set(2, 0, 0);
  const sphere = new THREE.Mesh(sphereGeometry, material);
  sphere.position.set(4, 0, 0);
  scene.add(circle);
  scene.add(plane);
  scene.add(sphere);
};

// 创建点状 线状球体
const createSphere = (scene) => {
  const geometry = new THREE.SphereGeometry(1, 32, 16);
  // 点状球体
  const pointMaterial = new THREE.PointsMaterial({
    color: 0x6600ff,
    size: 0.03,
  });
  // 线状物体
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x6600ff });
  const points = new THREE.Points(geometry, pointMaterial);
  const line = new THREE.Line(geometry, lineMaterial);
  line.position.set(2, 0, 0);
  scene.add(points);
  scene.add(line);
};

// 地球仪球体贴图
const createEarth = (scene) => {
  const texture = new THREE.TextureLoader().load("src/assets/images/earth.png");
  const geometry = new THREE.SphereGeometry(1, 32, 16);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const earth = new THREE.Mesh(geometry, material);
  scene.add(earth);
};

// 创建立方体贴图(全景公园)
const createImgCube = (scene) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const imgUrlArr = [
    "posx.jpg",
    "negx.jpg",
    "posy.jpg",
    "negy.jpg",
    "posz.jpg",
    "negz.jpg",
  ];
  const textureLoader = new THREE.TextureLoader(); // 纹理加载器
  textureLoader.setPath("src/assets/images/park/"); // 公共基础路径
  const materialArr = imgUrlArr.map((item) => {
    const texture = textureLoader.load(item);
    texture.colorSpace = THREE.SRGBColorSpace; // 设置图片颜色模式
    return new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
  });
  const cube = new THREE.Mesh(geometry, materialArr);
  scene.add(cube);
};

const renderLoop = (controls, renderer, scene, camera, stats) => {
  // cube.rotation.z += 0.1;
  // 旋转;
  renderer.render(scene, camera);
  // 必须手动update
  controls.update();
  stats.update();
  // 根据计算机浏览器刷新帧率，递归调用
  requestAnimationFrame(() =>
    renderLoop(controls, renderer, scene, camera, stats),
  );
};

// 删除立方体
const removeCube = (scene, group) => {
  window.addEventListener("dblclick", () => {
    group.children.map((item) => {
      item.geometry.dispose();
      item.material.dispose();
      group.remove(item);
    });
    // 移除组对象
    scene.remove(group);
    // 根据名称一个个删除
    // const arr = scene.children.filter((item) => item.name === "cu");
    // const cube = arr[0];
    // if (cube) {
    //   cube.geometry.dispose();
    //   cube.material.dispose();
    //   scene.remove(cube);
    // }
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
  camera.position.set(5, 5, 5);

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true }); // 抗锯齿
  // 创建轨道控制器
  const controls = useCreateControls(camera, renderer.domElement);
  // 设置画布大小
  renderer.setSize(window.innerWidth, window.innerHeight);

  useCreateHelper(scene);

  // const { cube, group } = createCube(scene);
  // createGeometry(scene);
  // createSphere(scene);
  // removeCube(scene, group);
  // createEarth(scene);
  createImgCube(scene);

  // 传入场景摄像机，渲染画面
  document.getElementById("my_three").appendChild(renderer.domElement);

  const stats = useCreateStats(); // 性能监视器

  renderLoop(controls, renderer, scene, camera, stats);
  // 渲染方法不放在最后会出现首次渲染不加载的问题
  // renderer.render(scene, camera);

  useResizeRender(renderer, camera);
});
</script>

<style lang="scss" scoped></style>
