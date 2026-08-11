import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Robot3DProProps {
  onClick?: () => void;
}

export function Robot3DPro({ onClick }: Robot3DProProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const robotRef = useRef<THREE.Group | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // إعداد المشهد
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    // إضاءة محسّنة
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x3b82f6, 0.8);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // الكاميرا
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2.5;

    // المرسام
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // إنشاء الروبوت المتقدم
    const robot = new THREE.Group();
    robotRef.current = robot;

    // المادة الرئيسية
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e40af,
      metalness: 0.7,
      roughness: 0.2,
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      metalness: 0.5,
      roughness: 0.3,
    });

    // الرأس (أسطواني)
    const headGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.6, 32);
    const head = new THREE.Mesh(headGeometry, metalMaterial);
    head.position.y = 1.3;
    head.castShadow = true;
    robot.add(head);

    // الهوائيات
    const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16);
    const antenna1 = new THREE.Mesh(antennaGeometry, accentMaterial);
    antenna1.position.set(-0.15, 1.8, 0);
    antenna1.castShadow = true;
    robot.add(antenna1);

    const antenna2 = new THREE.Mesh(antennaGeometry, accentMaterial);
    antenna2.position.set(0.15, 1.8, 0);
    antenna2.castShadow = true;
    robot.add(antenna2);

    // العيون (مضيئة)
    const eyeGeometry = new THREE.SphereGeometry(0.12, 32, 32);
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      metalness: 0.8,
      roughness: 0.1,
      emissive: 0x00ff88,
      emissiveIntensity: 0.5,
    });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 1.4, 0.35);
    leftEye.castShadow = true;
    robot.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 1.4, 0.35);
    rightEye.castShadow = true;
    robot.add(rightEye);

    // الجسم (صندوقي)
    const bodyGeometry = new THREE.BoxGeometry(0.5, 0.9, 0.5);
    const body = new THREE.Mesh(bodyGeometry, metalMaterial);
    body.position.y = 0.3;
    body.castShadow = true;
    robot.add(body);

    // لوحة الصدر
    const chestGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.05);
    const chest = new THREE.Mesh(chestGeometry, accentMaterial);
    chest.position.set(0, 0.5, 0.28);
    chest.castShadow = true;
    robot.add(chest);

    // الذراع اليسرى (مفصلية)
    const armGeometry = new THREE.BoxGeometry(0.2, 0.7, 0.2);
    const leftArm = new THREE.Mesh(armGeometry, metalMaterial);
    leftArm.position.set(-0.45, 0.7, 0);
    leftArm.castShadow = true;
    robot.add(leftArm);

    // الذراع اليمنى (مفصلية)
    const rightArm = new THREE.Mesh(armGeometry, metalMaterial);
    rightArm.position.set(0.45, 0.7, 0);
    rightArm.castShadow = true;
    robot.add(rightArm);

    // الساق اليسرى
    const legGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.2);
    const leftLeg = new THREE.Mesh(legGeometry, metalMaterial);
    leftLeg.position.set(-0.15, -0.6, 0);
    leftLeg.castShadow = true;
    robot.add(leftLeg);

    // الساق اليمنى
    const rightLeg = new THREE.Mesh(legGeometry, metalMaterial);
    rightLeg.position.set(0.15, -0.6, 0);
    rightLeg.castShadow = true;
    robot.add(rightLeg);

    // زر AI مضيء
    const buttonGeometry = new THREE.SphereGeometry(0.18, 32, 32);
    const buttonMaterial = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      metalness: 0.8,
      roughness: 0.1,
      emissive: 0xec4899,
      emissiveIntensity: 0.4,
    });
    const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
    button.position.set(0, -1.2, 0);
    button.castShadow = true;
    robot.add(button);

    scene.add(robot);

    // الحركة المتقدمة
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      timeRef.current += 0.016;

      // دوران سلس
      robot.rotation.y += 0.008;

      // حركة الذراع اليمنى (موجة ديناميكية)
      rightArm.rotation.z = -Math.PI / 6 + Math.sin(timeRef.current * 1.5) * 0.5;
      rightArm.position.y = 0.7 + Math.sin(timeRef.current * 1.5) * 0.15;

      // حركة الذراع اليسرى (إيماءة)
      leftArm.rotation.z = Math.PI / 6 + Math.sin(timeRef.current * 0.8) * 0.3;

      // حركة الرأس (إيماءة طبيعية)
      head.rotation.x = Math.sin(timeRef.current * 0.6) * 0.15;
      head.rotation.z = Math.sin(timeRef.current * 0.4) * 0.1;

      // توهج العيون
      if (leftEye.material instanceof THREE.MeshStandardMaterial) {
        leftEye.material.emissiveIntensity = 0.4 + Math.sin(timeRef.current * 2) * 0.2;
      }
      if (rightEye.material instanceof THREE.MeshStandardMaterial) {
        rightEye.material.emissiveIntensity = 0.4 + Math.sin(timeRef.current * 2) * 0.2;
      }

      // توهج الزر
      if (button.material instanceof THREE.MeshStandardMaterial) {
        button.material.emissiveIntensity = 0.4 + Math.sin(timeRef.current * 1.5) * 0.3;
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
