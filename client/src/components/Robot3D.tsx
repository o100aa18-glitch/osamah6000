import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Robot3DProps {
  onClick?: () => void;
}

export function Robot3D({ onClick }: Robot3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const robotRef = useRef<THREE.Group | null>(null);
  const leftArmRef = useRef<THREE.Group | null>(null);
  const rightArmRef = useRef<THREE.Group | null>(null);
  const headRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00d4ff, 0.5);
    pointLight.position.set(0, 2, 3);
    scene.add(pointLight);

    // Create Robot
    const robot = new THREE.Group();
    robotRef.current = robot;
    scene.add(robot);

    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.6, 1, 0.4);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a4a6a,
      metalness: 0.7,
      roughness: 0.3,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.position.y = 0;
    robot.add(body);

    // Head
    const headGroup = new THREE.Group();
    headRef.current = headGroup;
    headGroup.position.y = 0.8;
    robot.add(headGroup);

    const headGeometry = new THREE.BoxGeometry(0.5, 0.6, 0.5);
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a5a7a,
      metalness: 0.8,
      roughness: 0.2,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.castShadow = true;
    headGroup.add(head);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.8,
    });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.12, 0.1, 0.25);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.12, 0.1, 0.25);
    headGroup.add(rightEye);

    // Mouth (smile)
    const mouthGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.1);
    const mouthMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.5,
    });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, -0.15, 0.25);
    headGroup.add(mouth);

    // Left Arm
    const leftArmGroup = new THREE.Group();
    leftArmRef.current = leftArmGroup;
    leftArmGroup.position.set(-0.4, 0.3, 0);
    robot.add(leftArmGroup);

    const leftArmGeometry = new THREE.BoxGeometry(0.15, 0.6, 0.15);
    const armMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a4a6a,
      metalness: 0.7,
      roughness: 0.3,
    });
    const leftArm = new THREE.Mesh(leftArmGeometry, armMaterial);
    leftArm.castShadow = true;
    leftArmGroup.add(leftArm);

    // Right Arm (waving)
    const rightArmGroup = new THREE.Group();
    rightArmRef.current = rightArmGroup;
    rightArmGroup.position.set(0.4, 0.3, 0);
    rightArmGroup.rotation.order = 'YXZ';
    robot.add(rightArmGroup);

    const rightArm = new THREE.Mesh(leftArmGeometry, armMaterial);
    rightArm.castShadow = true;
    rightArmGroup.add(rightArm);

    // Hand
    const handGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const handMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a5a7a,
      metalness: 0.7,
      roughness: 0.3,
    });
    const hand = new THREE.Mesh(handGeometry, handMaterial);
    hand.castShadow = true;
    hand.position.y = -0.35;
    rightArmGroup.add(hand);

    // Keffiyeh (head covering)
    const keffiyehGeometry = new THREE.BoxGeometry(0.65, 0.15, 0.65);
    const keffiyehMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.3,
      roughness: 0.7,
    });
    const keffiyeh = new THREE.Mesh(keffiyehGeometry, keffiyehMaterial);
    keffiyeh.position.y = 0.35;
    keffiyeh.castShadow = true;
    headGroup.add(keffiyeh);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016; // ~60fps

      // Wave animation
      if (rightArmGroup) {
        rightArmGroup.rotation.z = Math.sin(time * 3) * 0.5 + 0.3;
      }

      // Head nod
      if (headGroup) {
        headGroup.rotation.x = Math.sin(time * 2) * 0.1;
        headGroup.rotation.y = Math.cos(time * 2.5) * 0.15;
      }

      // Gentle body sway
      if (robot) {
        robot.position.y = Math.sin(time * 1.5) * 0.05;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
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
