import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Robot3DRealProps {
  onClick?: () => void;
}

export function Robot3DReal({ onClick }: Robot3DRealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const robotRef = useRef<THREE.Group | null>(null);
  const animationStateRef = useRef({ time: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // إعداد المشهد
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // إضاءة
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // الكاميرا
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    // المرسام
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // إنشاء الروبوت
    const robot = new THREE.Group();
    robotRef.current = robot;

    // الرأس
    const headGeometry = new THREE.BoxGeometry(0.6, 0.7, 0.6);
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.3,
      roughness: 0.4,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.2;
    robot.add(head);

    // العيون
    const eyeGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.2,
    });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 1.4, 0.35);
    robot.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 1.4, 0.35);
    robot.add(rightEye);

    // البؤبؤ
    const pupilGeometry = new THREE.SphereGeometry(0.05, 32, 32);
    const pupilMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 0.8,
      roughness: 0.1,
    });
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(-0.15, 1.4, 0.4);
    robot.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(0.15, 1.4, 0.4);
    robot.add(rightPupil);

    // الجسم
    const bodyGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      metalness: 0.4,
      roughness: 0.3,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.3;
    robot.add(body);

    // الذراع اليسرى
    const armGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    const armMaterial = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.3,
      roughness: 0.4,
    });
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.4, 0.6, 0);
    leftArm.rotation.z = Math.PI / 6;
    robot.add(leftArm);

    // الذراع اليمنى
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.4, 0.6, 0);
    rightArm.rotation.z = -Math.PI / 6;
    robot.add(rightArm);

    // الساق اليسرى
    const legGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    const legMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e40af,
      metalness: 0.3,
      roughness: 0.4,
    });
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.15, -0.5, 0);
    robot.add(leftLeg);

    // الساق اليمنى
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.15, -0.5, 0);
    robot.add(rightLeg);

    // زر AI
    const buttonGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const buttonMaterial = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      metalness: 0.6,
      roughness: 0.2,
      emissive: 0xec4899,
      emissiveIntensity: 0.3,
    });
    const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
    button.position.set(0, -1.1, 0);
    robot.add(button);

    scene.add(robot);

    // الحركة
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const state = animationStateRef.current;
      state.time += 0.016; // ~60fps

      // دورة حركات متنوعة (10 ثواني)
      const cycleTime = state.time % 10;

      if (cycleTime < 2) {
        // المرحلة 1: يسلم بيده (0-2 ثانية)
        const progress = cycleTime / 2;
        rightArm.rotation.z = -Math.PI / 6 + Math.sin(progress * Math.PI) * 0.6;
        rightArm.position.y = 0.6 + Math.sin(progress * Math.PI) * 0.3;
        head.position.y = 0;
        body.position.y = 0;
      } else if (cycleTime < 4) {
        // المرحلة 2: يختفي (2-4 ثانية)
        const hideProgress = (cycleTime - 2) / 2;
        body.position.y = -hideProgress * 0.8;
        head.position.y = -hideProgress * 0.8;
        rightArm.rotation.z = -Math.PI / 6;
        rightArm.position.y = 0.6;
      } else if (cycleTime < 5.5) {
        // المرحلة 3: يظهر رأسه (4-5.5 ثانية)
        const showProgress = (cycleTime - 4) / 1.5;
        head.position.y = -0.8 + showProgress * 0.8;
        body.position.y = -0.8;
      } else if (cycleTime < 7.5) {
        // المرحلة 4: يسلم بسرعة (5.5-7.5 ثانية)
        const waveProgress = (cycleTime - 5.5) / 2;
        rightArm.rotation.z = -Math.PI / 6 + Math.sin(waveProgress * Math.PI * 6) * 0.8;
        rightArm.position.y = 0.6 + Math.sin(waveProgress * Math.PI * 6) * 0.2;
        head.position.y = 0;
        body.position.y = 0;
      } else {
        // المرحلة 5: استراحة (7.5-10 ثانية)
        rightArm.rotation.z = -Math.PI / 6;
        rightArm.position.y = 0.6;
        head.position.y = 0;
        body.position.y = 0;
      }

      // دوران خفيف
      robot.rotation.y += 0.005;

      // توهج الزر
      if (button.material instanceof THREE.MeshStandardMaterial) {
        button.material.emissiveIntensity = 0.3 + Math.sin(Date.now() * 0.003) * 0.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    // معالج تغيير حجم النافذة
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className="w-full h-full cursor-pointer"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
