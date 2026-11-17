'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

export interface TechCoreCanvasProps {
  colorScheme?: 'hero' | 'banner';
  interactive?: boolean;
}

function Scene({ colorScheme = 'hero', interactive = true }: TechCoreCanvasProps) {
  const isBanner = colorScheme === 'banner';
  const primaryColor = isBanner ? '#38BDF8' : '#2563EB'; // Cyan in banner, Royal Blue in hero
  const secondaryColor = isBanner ? '#818CF8' : '#3B82F6';
  const nucleusColor = isBanner ? '#0B132B' : '#0F172A';

  const nucleusRef = useRef<THREE.Mesh>(null);
  const wireIcosaRef = useRef<THREE.LineSegments>(null);
  const wireDodecaRef = useRef<THREE.LineSegments>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const nodesGroupRef = useRef<THREE.Group>(null);

  // Precompute orbital ring vertices
  const ringPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 64;
    const radius = 2.4;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    return points;
  }, []);

  const ringGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(ringPoints);
  }, [ringPoints]);

  // Orbiting satellite data
  const satellites = useMemo(() => {
    const items = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.4;
      const yVariation = Math.sin(i * 1.8) * 0.35;
      items.push({
        position: [
          Math.cos(angle) * radius,
          yVariation,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        size: 0.08 + (i % 3) * 0.03,
        color: i % 2 === 0 ? primaryColor : secondaryColor,
      });
    }
    return items;
  }, [primaryColor, secondaryColor]);

  // Dynamic continuous rotation & pulsation
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (nucleusRef.current) {
      nucleusRef.current.rotation.x = t * 0.2;
      nucleusRef.current.rotation.y = t * 0.3;
    }

    if (wireIcosaRef.current) {
      wireIcosaRef.current.rotation.x = -t * 0.15;
      wireIcosaRef.current.rotation.z = t * 0.22;
      const scale = 1 + Math.sin(t * 1.5) * 0.03;
      wireIcosaRef.current.scale.set(scale, scale, scale);
    }

    if (wireDodecaRef.current) {
      wireDodecaRef.current.rotation.y = t * 0.18;
      wireDodecaRef.current.rotation.z = -t * 0.12;
    }

    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.z = Math.sin(t * 0.4) * 0.2;
    }

    if (nodesGroupRef.current) {
      nodesGroupRef.current.rotation.y = t * 0.45;
    }
  });

  return (
    <>
      {/* Lighting System */}
      <ambientLight intensity={isBanner ? 0.6 : 0.8} />
      <pointLight position={[10, 10, 10]} intensity={isBanner ? 1.4 : 1.2} color={secondaryColor} />
      <pointLight position={[-10, -10, -5]} intensity={0.8} color={primaryColor} />

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <group>
          {/* Central Deep Navy Faceted Solid Nucleus */}
          <mesh ref={nucleusRef}>
            <icosahedronGeometry args={[1.0, 0]} />
            <meshStandardMaterial
              color={nucleusColor}
              roughness={0.25}
              metalness={0.85}
              wireframe={false}
            />
          </mesh>

          {/* Primary High-Precision Wireframe Icosahedron */}
          <lineSegments ref={wireIcosaRef}>
            <edgesGeometry args={[new THREE.IcosahedronGeometry(1.5, 1)]} />
            <lineBasicMaterial
              color={primaryColor}
              transparent
              opacity={isBanner ? 0.85 : 0.65}
              linewidth={1.5}
            />
          </lineSegments>

          {/* Outer Protective Dodecahedron Cage */}
          <lineSegments ref={wireDodecaRef}>
            <edgesGeometry args={[new THREE.DodecahedronGeometry(1.9, 0)]} />
            <lineBasicMaterial
              color={secondaryColor}
              transparent
              opacity={isBanner ? 0.45 : 0.3}
            />
          </lineSegments>

          {/* Angled Orbital Track Ring */}
          <group ref={orbitGroupRef} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
            <lineLoop geometry={ringGeometry}>
              <lineBasicMaterial
                color={primaryColor}
                transparent
                opacity={isBanner ? 0.5 : 0.35}
              />
            </lineLoop>
          </group>

          {/* Orbiting Satellite Data Nodes */}
          <group ref={nodesGroupRef} rotation={[Math.PI / 5, 0, 0]}>
            {satellites.map((node, i) => (
              <mesh key={i} position={node.position}>
                <sphereGeometry args={[node.size, 16, 16]} />
                <meshStandardMaterial
                  color={node.color}
                  emissive={node.color}
                  emissiveIntensity={isBanner ? 2.0 : 1.4}
                  roughness={0.2}
                />
              </mesh>
            ))}
          </group>
        </group>
      </Float>

      {/* OrbitControls: Allows smooth drag-to-rotate with zoom strictly disabled */}
      {interactive && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.8}
          autoRotate={false}
          dampingFactor={0.05}
        />
      )}
    </>
  );
}

export default function TechCoreCanvas({
  colorScheme = 'hero',
  interactive = true,
}: TechCoreCanvasProps) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <Scene colorScheme={colorScheme} interactive={interactive} />
      </Canvas>
    </div>
  );
}

