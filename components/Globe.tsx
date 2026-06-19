'use client';

import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export const GLOBE_RADIUS = 2;

// Public-domain NASA night-lights Earth texture (Black Marble style).
const NIGHT_TEXTURE =
  'https://unpkg.com/three-globe@2.31.0/example/img/earth-night.jpg';

export default function Globe({ autoRotate }: { autoRotate: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, NIGHT_TEXTURE);

  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      {/* Ambient light yang lebih terang untuk terangin keseluruhan */}
      <ambientLight intensity={1.5} color={0xffffff} />

      {/* Main directional light dari depan */}
      <directionalLight
        position={[5, 3, 8]}
        intensity={2.5}
        color={0xffffff}
        castShadow
      />

      {/* Hemisphere light untuk ambient bumi */}
      <hemisphereLight
        args={[0x87ceeb, 0x1a1a2e, 1.8]}
      />

      {/* Fill light dari belakang untuk menghilangkan shadow */}
      <directionalLight
        position={[-4, 2, -6]}
        intensity={1.2}
        color={0xadd8e6}
      />

      {/* Point light di atas untuk highlight */}
      <pointLight
        position={[3, 3, 4]}
        intensity={1.0}
        color={0xffffff}
      />

      {/* Additional side light untuk dimensi */}
      <pointLight
        position={[-3, -1, 3]}
        intensity={0.7}
        color={0x87ceeb}
      />

      <mesh ref={meshRef}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshPhongMaterial
          map={texture}
          emissiveMap={texture}
          emissive={new THREE.Color(0xc0d9e8)}
          emissiveIntensity={1.5}
          color={new THREE.Color(0xb3c8d9)}
          shininess={64}
          specularMap={texture}
          specular={new THREE.Color(0x7a95b0)}
        />
      </mesh>
      <Atmosphere />
      <AtmosphereGlow />
    </group>
  );
}

// Soft glowing atmosphere rendered as a back-side shader shell.
function Atmosphere() {
  return (
    <mesh scale={1.15}>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        uniforms={{ glowColor: { value: new THREE.Color(0x6db3d5) } }}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          uniform vec3 glowColor;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
            gl_FragColor = vec4(glowColor, 1.0) * intensity;
          }
        `}
      />
    </mesh>
  );
}

// Additional outer glow untuk efek yang lebih smooth
function AtmosphereGlow() {
  return (
    <mesh scale={1.25}>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        uniforms={{ glowColor: { value: new THREE.Color(0x4a9fd8) } }}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          uniform vec3 glowColor;
          void main() {
            float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            gl_FragColor = vec4(glowColor, 0.8) * intensity;
          }
        `}
      />
    </mesh>
  );
}
