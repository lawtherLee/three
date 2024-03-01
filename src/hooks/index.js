import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import * as dat from "dat.gui";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/**
 * 创建坐标系
 * @param scene
 */
export const useCreateHelper = (scene) => {
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);
};

// 创建性能监视器
export const useCreateStats = () => {
  const stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = "fixed";
  stats.domElement.style.top = "0";
  stats.domElement.style.left = "0";
  document.body.appendChild(stats.domElement);
  return stats;
};

// 适配浏览器窗口变化
export const useResizeRender = (renderer, camera) => {
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // 更新视锥体空间
  });
};

// 创建图形界面工具
export const useCreateGUI = (cube, controls) => {
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

  // 通过GUI控制立方体方向
  const folder = gui.addFolder("位移");
  folder.add(cube.position, "x", 0, 5, 0.1);
  folder.add(cube.position, "y", 0, 5, 0.1);
  folder.add(cube.position, "z", 0, 5, 0.1);

  // 下拉菜单
  gui
    .add({ scheme: "default" }, "scheme", {
      default: "default",
      top: "top",
      bottom: "bottom",
      left: "left",
      right: "right",
    })
    .onChange((val) => {
      switch (val) {
        case "top":
          cube.position.set(0, 2, 0);
          break;
        case "bottom":
          cube.position.set(0, -2, 0);
          break;
        case "default":
          cube.position.set(0, 0, 0);
          break;
        case "left":
          cube.position.set(-2, 0, 0);
          break;
        case "right":
          cube.position.set(2, 0, 0);
          break;
      }
    });
};

// 轨道控制器
export const useCreateControls = (camera, rendererDom) => {
  const controls = new OrbitControls(camera, rendererDom);
  controls.enableDamping = true; // 阻尼效果
  controls.autoRotate = false; // 自动旋转
  // 垂直角度范围控制
  controls.maxPolarAngle = Math.PI;
  controls.minPolarAngle = 0;
  //水平角度范围控制
  controls.maxAzimuthAngle = 1.5 * Math.PI; // 摄像机左右翻转最大距离
  // controls.minAzimuthAngle = 0.5 * Math.PI; // 摄像机左右翻转最小距离
  // 摄像机移动范围控制
  controls.minDistance = 0; // 可移动最近距离
  controls.maxDistance = 100; // 可移动最远距离
  return controls;
};
