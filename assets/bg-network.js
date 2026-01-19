import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js";

export function startBackgroundNet(mountId = "bg") {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 110;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  mount.appendChild(renderer.domElement);

  const POINTS = 95;
  const BOUNDS = 140;
  const MAX_DIST = 42;
  const SPEED = 0.16;
  const COLOR = 0xff0033;

  const positions = new Float32Array(POINTS * 3);
  const velocities = new Float32Array(POINTS * 3);

  for (let i = 0; i < POINTS; i++) {
    const i3 = i * 3;
    positions[i3 + 0] = (Math.random() - 0.5) * BOUNDS;
    positions[i3 + 1] = (Math.random() - 0.5) * BOUNDS;
    positions[i3 + 2] = (Math.random() - 0.5) * BOUNDS;

    velocities[i3 + 0] = (Math.random() - 0.5) * SPEED;
    velocities[i3 + 1] = (Math.random() - 0.5) * SPEED;
    velocities[i3 + 2] = (Math.random() - 0.5) * SPEED;
  }

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const pointsMat = new THREE.PointsMaterial({
    color: COLOR,
    size: 1.6,
    transparent: true,
    opacity: 0.55
  });

  scene.add(new THREE.Points(pointsGeo, pointsMat));

  const lineGeo = new THREE.BufferGeometry();
  const lineMat = new THREE.LineBasicMaterial({
    color: COLOR,
    transparent: true,
    opacity: 0.18
  });

  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  function rebuildLines() {
    const verts = [];
    for (let i = 0; i < POINTS; i++) {
      const ax = positions[i * 3 + 0];
      const ay = positions[i * 3 + 1];
      const az = positions[i * 3 + 2];

      for (let j = i + 1; j < POINTS; j++) {
        const bx = positions[j * 3 + 0];
        const by = positions[j * 3 + 1];
        const bz = positions[j * 3 + 2];

        const dx = ax - bx, dy = ay - by, dz = az - bz;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if (dist < MAX_DIST) verts.push(ax, ay, az, bx, by, bz);
      }
    }
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    lineGeo.computeBoundingSphere();
  }

  function updatePoints() {
    for (let i = 0; i < POINTS; i++) {
      const i3 = i * 3;
      positions[i3 + 0] += velocities[i3 + 0];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      for (let k = 0; k < 3; k++) {
        const idx = i3 + k;
        if (positions[idx] > BOUNDS / 2 || positions[idx] < -BOUNDS / 2) {
          velocities[idx] *= -1;
        }
      }
    }
    pointsGeo.attributes.position.needsUpdate = true;
  }

  let t = 0;
  let alive = true;

  function animate() {
    if (!alive) return;
    t += 0.01;
    updatePoints();
    rebuildLines();
    scene.rotation.y = Math.sin(t * 0.2) * 0.15;
    scene.rotation.x = Math.cos(t * 0.17) * 0.10;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  function onResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onResize);

  // return a cleanup function (nice habit)
  return () => {
    alive = false;
    window.removeEventListener("resize", onResize);
    renderer.dispose();
    mount.innerHTML = "";
  };
}
