import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Robot3DStaticProps {
  onClick?: () => void;
}

export function Robot3DStatic({ onClick }: Robot3DStaticProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const robotRef = useRef<THREE.Group | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // إعداد المشهد
    const scene = new THREE.Scene();
    scene.background = null; // خلفية شفافة
    sceneRef.current = scene;

    // إضاءة احترافية
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00d4ff, 0.8);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // الكاميرا
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3.5;

    // المرسام مع خلفية شفافة
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // إنشاء الروبوت الثابت
    const robot = new THREE.Group();
    robotRef.current = robot;

    // المواد المتقدمة
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1.2,
    });

    const blueMaterial = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.6,
      roughness: 0.2,
    });

    const whiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8f9fa,
      metalness: 0.3,
      roughness: 0.4,
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      metalness: 0.8,
      roughness: 0.05,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.8,
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0e27,
      metalness: 0.7,
      roughness: 0.1,
      emissive: 0x1e40af,
      emissiveIntensity: 0.3,
    });

    // الرأس (مستطيل مستدير)
    const headGroup = new THREE.Group();
    const headGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.6);
    const head = new THREE.Mesh(headGeometry, whiteMaterial);
    head.castShadow = true;
    headGroup.add(head);

    // الشاشة (وجه الروبوت)
    const screenGeometry = new THREE.PlaneGeometry(0.5, 0.6);
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.31;
    headGroup.add(screen);

    // العيون (زرقاء فيروزية مضيئة)
    const eyeGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 0.15, 0.35);
    leftEye.castShadow = true;
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 0.15, 0.35);
    rightEye.castShadow = true;
    headGroup.add(rightEye);

    // الهوائيات
    const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
    const leftAntenna = new THREE.Mesh(antennaGeometry, metalMaterial);
    leftAntenna.position.set(-0.2, 0.5, 0);
    leftAntenna.castShadow = true;
    headGroup.add(leftAntenna);

    const rightAntenna = new THREE.Mesh(antennaGeometry, metalMaterial);
    rightAntenna.position.set(0.2, 0.5, 0);
    rightAntenna.castShadow = true;
    headGroup.add(rightAntenna);

    headGroup.position.y = 1.2;
    robot.add(headGroup);

    // الجسم (مستطيل مستدير)
    const bodyGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.5);
    const body = new THREE.Mesh(bodyGeometry, blueMaterial);
    body.position.y = 0.2;
    body.castShadow = true;
    robot.add(body);

    // لوحة الصدر (معدنية)
    const chestGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.1);
    const chest = new THREE.Mesh(chestGeometry, metalMaterial);
    chest.position.set(0, 0.2, 0.26);
    chest.castShadow = true;
    robot.add(chest);

    // نقطة مضيئة في الصدر
    const chestLightGeometry = new THREE.SphereGeometry(0.08, 32, 32);
    const chestLight = new THREE.Mesh(chestLightGeometry, eyeMaterial);
    chestLight.position.set(0, 0.2, 0.35);
    chestLight.castShadow = true;
    robot.add(chestLight);

    // الذراع اليسرى
    const leftArmGroup = new THREE.Group();
    const leftArmGeometry = new THREE.BoxGeometry(0.2, 0.7, 0.2);
    const leftArm = new THREE.Mesh(leftArmGeometry, blueMaterial);
    leftArm.castShadow = true;
    leftArmGroup.add(leftArm);
    leftArmGroup.position.set(-0.4, 0.6, 0);
    robot.add(leftArmGroup);

    // الذراع اليمنى (قابلة للحركة - التسليم)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.4, 0.6, 0);
    const rightArmGeometry = new THREE.BoxGeometry(0.2, 0.7, 0.2);
    const rightArm = new THREE.Mesh(rightArmGeometry, blueMaterial);
    rightArm.castShadow = true;
    rightArmGroup.add(rightArm);
    robot.add(rightArmGroup);

    // الساق اليسرى
    const leftLegGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    const leftLeg = new THREE.Mesh(leftLegGeometry, metalMaterial);
    leftLeg.position.set(-0.15, -0.6, 0);
    leftLeg.castShadow = true;
    robot.add(leftLeg);

    // الساق اليمنى
    const rightLegGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    const rightLeg = new THREE.Mesh(rightLegGeometry, metalMaterial);
    rightLeg.position.set(0.15, -0.6, 0);
    rightLeg.castShadow = true;
    robot.add(rightLeg);

    // القدم اليسرى
    const leftFootGeometry = new THREE.BoxGeometry(0.25, 0.15, 0.3);
    const leftFoot = new THREE.Mesh(leftFootGeometry, metalMaterial);
    leftFoot.position.set(-0.15, -1.0, 0);
    leftFoot.castShadow = true;
    robot.add(leftFoot);

    // القدم اليمنى
    const rightFootGeometry = new THREE.BoxGeometry(0.25, 0.15, 0.3);
    const rightFoot = new THREE.Mesh(rightFootGeometry, metalMaterial);
    rightFoot.position.set(0.15, -1.0, 0);
    rightFoot.castShadow = true;
    robot.add(rightFoot);

    scene.add(robot);

    // الحركة (بدون دوران للروبوت)
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      timeRef.current += 0.016;

      // **بدون دوران للروبوت** - ثابت في مكانه
      // robot.rotation.y = 0; // ثابت

      // حركة الرأس (إيماءة طبيعية)
      headGroup.rotation.x = Math.sin(timeRef.current * 0.5) * 0.12;
      headGroup.rotation.z = Math.sin(timeRef.current * 0.3) * 0.1;

      // حركة الهوائيات
      leftAntenna.rotation.z = Math.sin(timeRef.current * 1.5) * 0.2;
      rightAntenna.rotation.z = -Math.sin(timeRef.current * 1.5) * 0.2;

      // حركة الذراع اليمنى (موجة ودية - التسليم)
      rightArmGroup.rotation.z = Math.sin(timeRef.current * 1.2) * 0.6;
      rightArmGroup.position.y = 0.6 + Math.sin(timeRef.current * 1.5) * 0.2;

      // حركة الذراع اليسرى
      leftArmGroup.rotation.z = -Math.sin(timeRef.current * 0.9) * 0.4;
      leftArmGroup.position.y = 0.6 + Math.sin(timeRef.current * 1.2) * 0.15;

      // حركة الساقين (خطوات خفيفة)
      leftLeg.position.y = -0.6 + Math.sin(timeRef.current * 1.2) * 0.05;
      rightLeg.position.y = -0.6 - Math.sin(timeRef.current * 1.2) * 0.05;

      // توهج العيون
      if (leftEye.material instanceof THREE.MeshStandardMaterial) {
        leftEye.material.emissiveIntensity = 0.6 + Math.sin(timeRef.current * 2.5) * 0.4;
      }
      if (rightEye.material instanceof THREE.MeshStandardMaterial) {
        rightEye.material.emissiveIntensity = 0.6 + Math.sin(timeRef.current * 2.5) * 0.4;
      }

      // توهج الصدر
      if (chestLight.material instanceof THREE.MeshStandardMaterial) {
        chestLight.material.emissiveIntensity = 0.5 + Math.sin(timeRef.current * 1.8) * 0.5;
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
