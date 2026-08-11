import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Robot3DModernProps {
  onClick?: () => void;
}

export function Robot3DModern({ onClick }: Robot3DModernProps) {
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

    // إضاءة
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // الكاميرا
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2.8;

    // المرسام
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // إنشاء الروبوت الحديث
    const robot = new THREE.Group();
    robotRef.current = robot;

    // المواد
    const whiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      metalness: 0.3,
      roughness: 0.4,
    });

    const blueMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      metalness: 0.4,
      roughness: 0.3,
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.6,
      roughness: 0.2,
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      metalness: 0.8,
      roughness: 0.1,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.6,
    });

    // الرأس (مربع مستدير)
    const headGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    const head = new THREE.Mesh(headGeometry, whiteMaterial);
    head.position.y = 1.3;
    robot.add(head);

    // تدوير زوايا الرأس
    head.geometry.translate(0, 0, 0);

    // الشاشة (سوداء)
    const screenGeometry = new THREE.PlaneGeometry(0.5, 0.5);
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 1.3, 0.36);
    robot.add(screen);

    // العيون (زرقاء فيروزية)
    const eyeGeometry = new THREE.SphereGeometry(0.12, 32, 32);
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 1.45, 0.4);
    robot.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 1.45, 0.4);
    robot.add(rightEye);

    // الجسم (كرة مستديرة)
    const bodyGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const body = new THREE.Mesh(bodyGeometry, blueMaterial);
    body.position.y = 0.2;
    body.scale.set(1, 1.2, 1);
    robot.add(body);

    // لوحة الصدر (بيضاء)
    const chestGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const chest = new THREE.Mesh(chestGeometry, whiteMaterial);
    chest.position.set(0, 0.2, 0.45);
    robot.add(chest);

    // نقطة مضيئة في الصدر
    const chestLightGeometry = new THREE.SphereGeometry(0.08, 32, 32);
    const chestLight = new THREE.Mesh(chestLightGeometry, eyeMaterial);
    chestLight.position.set(0, 0.2, 0.5);
    robot.add(chestLight);

    // الذراع اليسرى (مستديرة)
    const armGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const leftArm = new THREE.Mesh(armGeometry, blueMaterial);
    leftArm.position.set(-0.6, 0.5, 0);
    leftArm.scale.set(1, 1.3, 1);
    robot.add(leftArm);

    // الذراع اليمنى (مستديرة)
    const rightArm = new THREE.Mesh(armGeometry, blueMaterial);
    rightArm.position.set(0.6, 0.5, 0);
    rightArm.scale.set(1, 1.3, 1);
    robot.add(rightArm);

    // الساق اليسرى (مستديرة)
    const legGeometry = new THREE.SphereGeometry(0.18, 32, 32);
    const leftLeg = new THREE.Mesh(legGeometry, blueMaterial);
    leftLeg.position.set(-0.25, -0.7, 0);
    leftLeg.scale.set(1, 1.4, 1);
    robot.add(leftLeg);

    // الساق اليمنى (مستديرة)
    const rightLeg = new THREE.Mesh(legGeometry, blueMaterial);
    rightLeg.position.set(0.25, -0.7, 0);
    rightLeg.scale.set(1, 1.4, 1);
    robot.add(rightLeg);

    // الأذن اليسرى (زرقاء)
    const earGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const leftEar = new THREE.Mesh(earGeometry, blueMaterial);
    leftEar.position.set(-0.45, 1.4, 0);
    leftEar.scale.set(1, 1.5, 0.8);
    robot.add(leftEar);

    // الأذن اليمنى (زرقاء)
    const rightEar = new THREE.Mesh(earGeometry, blueMaterial);
    rightEar.position.set(0.45, 1.4, 0);
    rightEar.scale.set(1, 1.5, 0.8);
    robot.add(rightEar);

    scene.add(robot);

    // الحركة
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      timeRef.current += 0.016;

      // دوران سلس
      robot.rotation.y += 0.006;

      // حركة الذراع اليمنى (موجة ودية)
      rightArm.position.y = 0.5 + Math.sin(timeRef.current * 1.5) * 0.2;
      rightArm.rotation.z = Math.sin(timeRef.current * 1.2) * 0.4;

      // حركة الذراع اليسرى
      leftArm.position.y = 0.5 + Math.sin(timeRef.current * 1.2) * 0.15;
      leftArm.rotation.z = -Math.sin(timeRef.current * 0.9) * 0.3;

      // حركة الرأس (إيماءة طبيعية)
      head.rotation.x = Math.sin(timeRef.current * 0.5) * 0.1;
      head.rotation.z = Math.sin(timeRef.current * 0.3) * 0.08;

      // توهج العيون
      if (leftEye.material instanceof THREE.MeshStandardMaterial) {
        leftEye.material.emissiveIntensity = 0.5 + Math.sin(timeRef.current * 2) * 0.3;
      }
      if (rightEye.material instanceof THREE.MeshStandardMaterial) {
        rightEye.material.emissiveIntensity = 0.5 + Math.sin(timeRef.current * 2) * 0.3;
      }

      // توهج الصدر
      if (chestLight.material instanceof THREE.MeshStandardMaterial) {
        chestLight.material.emissiveIntensity = 0.5 + Math.sin(timeRef.current * 1.5) * 0.4;
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
