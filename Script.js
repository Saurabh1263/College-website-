// 3D Floating Geometry with Three.js
let scene, camera, renderer, controls, particles;

function init3D() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threejs-canvas'), alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Floating Particles
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * 2000 - 1000;
    const y = Math.random() * 2000 - 1000;
    const z = Math.random() * 2000 - 1000;
    vertices.push(x, y, z);
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  const material = new THREE.PointsMaterial({
    color: 0x88ccff,
    size: 4,
    transparent: true,
    opacity: 0.8
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Golden 3D Shape (Torus)
  const torusGeometry = new THREE.TorusGeometry(100, 30, 16, 100);
  const torusMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    wireframe: true
  });
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  scene.add(torus);

  camera.position.z = 500;
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.enableZoom = false;

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    torus.rotation.x += 0.005;
    torus.rotation.y += 0.008;
    particles.rotation.y += 0.0005;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// Counter Animation
function animateCounters() {
  const counters = document.querySelectorAll('.stat h3');
  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText.replace(/\D/g, '');
      const speed = 100;
      const increment = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment) + (counter.innerText.includes('%') ? '%' : '+');
        setTimeout(updateCount, 30);
      } else {
        counter.innerText = target + (counter.innerText.includes('%') ? '%' : '+');
      }
    };
    updateCount();
  });
}

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.id === 'about') {
        animateCounters();
      }
    }
  });
});

observer.observe(document.querySelector('#about'));

// Initialize
init3D();

// Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
