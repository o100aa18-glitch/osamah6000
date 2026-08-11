import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RobotWatermarkProps {
  onClick?: () => void;
}

export function RobotWatermark({ onClick }: RobotWatermarkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const robotRef = useRef<THREE.Group | null>(null);
  const timeRef = useRef(0);
  const stateRef = useRef<'idle' | 'wave' | 'spin' | 'hide'>('idle');
  const stateTimeRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // إعداد المشهد
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // إضاءة
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

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
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // إنشاء الروبوت
    const robot = new THREE.Group();
    robotRef.current = robot;

    // المواد
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      metalness: 0.4,
      roughness: 0.3,
    });

    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      metalness: 0.3,
      roughness: 0.4,
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.8,
    });

    // الجسم (كرة)
    const bodyGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.scale.set(1, 1.2, 1);
    robot.add(body);

    // الرأس (كرة صغيرة)
    const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.6;
    robot.add(head);

    // العيون
    const eyeGeometry = new THREE.SphereGeometry(0.08, 32, 32);
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.1, 0.75, 0.25);
    robot.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.1, 0.75, 0.25);
    robot.add(rightEye);

    // الذراع اليسرى
    const leftArmGeometry = new THREE.SphereGeometry(0.12, 32, 32);
    const leftArm = new THREE.Mesh(leftArmGeometry, bodyMaterial);
    leftArm.position.set(-0.35, 0.2, 0);
    leftArm.scale.set(0.8, 1.5, 0.8);
    robot.add(leftArm);

    // الذراع اليمنى (قابلة للحركة)
    const rightArmGroup = new THREE.Group();
    const rightArmGeometry = new THREE.SphereGeometry(0.12, 32, 32);
    const rightArm = new THREE.Mesh(rightArmGeometry, bodyMaterial);
    rightArm.scale.set(0.8, 1.5, 0.8);
    rightArmGroup.add(rightArm);
    rightArmGroup.position.set(0.35, 0.2, 0);
    robot.add(rightArmGroup);

    // الساق اليسرى
    const leftLegGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const leftLeg = new THREE.Mesh(leftLegGeometry, bodyMaterial);
    leftLeg.position.set(-0.15, -0.5, 0);
    leftLeg.scale.set(0.7, 1.3, 0.7);
    robot.add(leftLeg);

    // الساق اليمنى
    const rightLegGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const rightLeg = new THREE.Mesh(rightLegGeometry, bodyMaterial);
    rightLeg.position.set(0.15, -0.5, 0);
    rightLeg.scale.set(0.7, 1.3, 0.7);
    robot.add(rightLeg);

    scene.add(robot);

    // الحركة والحالات
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      timeRef.current += 0.016;
      stateTimeRef.current += 0.016;

      // تغيير الحالة كل 4 ثواني
      if (stateTimeRef.current > 4) {
        stateTimeRef.current = 0;
        const states: Array<'idle' | 'wave' | 'spin' | 'hide'> = ['idle', 'wave', 'spin', 'hide'];
        stateRef.current = states[Math.floor(Math.random() * states.length)];
      }

      // حركات العيون (توهج)
      if (leftEye.material instanceof THREE.MeshStandardMaterial) {
        leftEye.material.emissiveIntensity = 0.6 + Math.sin(timeRef.current * 2) * 0.4;
      }
      if (rightEye.material instanceof THREE.MeshStandardMaterial) {
        rightEye.material.emissiveIntensity = 0.6 + Math.sin(timeRef.current * 2) * 0.4;
      }

      // حركات الرأس (إيماءة)
      head.rotation.x = Math.sin(timeRef.current * 0.5) * 0.1;
      head.rotation.z = Math.sin(timeRef.current * 0.3) * 0.08;

      // حركات الساقين (خطوات خفيفة)
      leftLeg.position.y = -0.5 + Math.sin(timeRef.current * 1.2) * 0.05;
      rightLeg.position.y = -0.5 - Math.sin(timeRef.current * 1.2) * 0.05;

      // الحالات المختلفة
      if (stateRef.current === 'wave') {
        // التسليم بالموجة
        rightArmGroup.rotation.z = Math.sin(stateTimeRef.current * 3) * 0.8;
        rightArmGroup.position.y = 0.2 + Math.sin(stateTimeRef.current * 2) * 0.15;
      } else if (stateRef.current === 'spin') {
        // الدوران حول النفس
        robot.rotation.y += 0.04;
        rightArmGroup.rotation.z = Math.sin(timeRef.current * 1.5) * 0.3;
      } else if (stateRef.current === 'hide') {
        // الاختفاء والعودة
        const hideProgress = stateTimeRef.current / 4;
        if (hideProgress < 0.5) {
          robot.scale.set(1 - hideProgress * 2, 1 - hideProgress * 2, 1 - hideProgress * 2);
        } else {
          robot.scale.set((hideProgress - 0.5) * 2, (hideProgress - 0.5) * 2, (hideProgress - 0.5) * 2);
        }
        rightArmGroup.rotation.z = Math.sin(timeRef.current * 1.5) * 0.3;
      } else {
        // الحالة الهادئة
        robot.rotation.y = 0;
        robot.scale.set(1, 1, 1);
        rightArmGroup.rotation.z = Math.sin(timeRef.current * 1) * 0.2;
        rightArmGroup.position.y = 0.2 + Math.sin(timeRef.current * 1.5) * 0.1;
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
