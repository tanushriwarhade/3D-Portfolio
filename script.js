// script.js
let scene, camera, renderer;
let particles = [];
let orbs = [];

function initThree() {
  const canvas = document.getElementById('hero-canvas');

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0a0a, 100, 1000);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    antialias: true, 
    alpha: true 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const light1 = new THREE.PointLight(0x00ffff, 2, 100);
  light1.position.set(10, 10, 20);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xff00ff, 2, 100);
  light2.position.set(-10, -10, 20);
  scene.add(light2);

  // Stars / Particles
  const particleCount = 800;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i]     = (Math.random() - 0.5) * 120;
    positions[i + 1] = (Math.random() - 0.5) * 120;
    positions[i + 2] = (Math.random() - 0.5) * 120;
    colors[i] = colors[i+1] = colors[i+2] = Math.random();
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);
  particles.push(particleSystem);

  // Floating Orbs
  const orbColors = [0x00ffff, 0xff00ff, 0xffff00, 0x00ff00];
  for (let i = 0; i < 6; i++) {
    const geometry = new THREE.SphereGeometry(1.2, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: orbColors[i % orbColors.length],
      emissive: orbColors[i % orbColors.length],
      shininess: 100,
      transparent: true,
      opacity: 0.9
    });
    const orb = new THREE.Mesh(geometry, material);
    
    orb.position.set(
      (Math.random() - 0.5) * 25,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 15 - 10
    );
    
    orb.userData = { speed: 0.02 + Math.random() * 0.03, angle: Math.random() * Math.PI * 2 };
    scene.add(orb);
    orbs.push(orb);
  }

  // Mouse Interaction
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    orbs.forEach(orb => {
      orb.rotation.y += 0.008;
      orb.position.x += Math.sin(orb.userData.angle) * 0.03;
      orb.userData.angle += orb.userData.speed;
    });

    camera.position.x = mouseX * 8;
    camera.position.y = mouseY * 8;
    camera.lookAt(0, 0, 0);

    particles[0].rotation.y += 0.0005;

    renderer.render(scene, camera);
  }
  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Contact Form
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  console.log('%c📨 Message Received:', 'background:#22ff88;color:black;padding:4px 8px;border-radius:6px;');
  console.log({ name, email, message, time: new Date().toISOString() });

  const status = document.getElementById('formStatus');
  status.classList.remove('hidden');
  status.textContent = '✅ Message sent successfully! (Backend simulated)';

  setTimeout(() => {
    this.reset();
    status.classList.add('hidden');
  }, 4000);
});

// Initialize 3D Scene
window.onload = initThree;
