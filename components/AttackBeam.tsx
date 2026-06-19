'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { latLngToVector3, buildArc } from '@/lib/geo';
import { GLOBE_RADIUS } from './Globe';
import { ATTACK_COLORS, THREAT_LEVEL_NAMES } from '@/lib/types';
import type { AttackEvent } from '@/lib/types';

const HEAD_COLOR = new THREE.Color('#ffffff');
const DURATION = 1.9; // seconds for beam to travel the arc

interface Props {
  event: AttackEvent;
  paused: boolean;
  onDone: (id: string) => void;
}

/**
 * Get colors based on attack type and threat level
 */
function getAttackColors(attackType: string, threatLevel: 1 | 2 | 3 | 4 | 5) {
  const colorMap = ATTACK_COLORS as Record<string, Record<1 | 2 | 3 | 4 | 5, string>>;
  const colorHex = colorMap[attackType]?.[threatLevel] || '#3aa0ff';
  return {
    color: colorHex,
    sourceColor: new THREE.Color(colorHex),
    targetColor: new THREE.Color(colorHex),
  };
}

/**
 * Get glow intensity based on threat level
 */
function getGlowIntensity(threatLevel: 1 | 2 | 3 | 4 | 5): number {
  const intensities: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0.15,
    2: 0.22,
    3: 0.30,
    4: 0.40,
    5: 0.50,
  };
  return intensities[threatLevel];
}

/**
 * Get animation speed based on threat level
 */
function getAnimationSpeed(threatLevel: 1 | 2 | 3 | 4 | 5): number {
  const speeds: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 1.0,
    2: 1.2,
    3: 1.4,
    4: 1.6,
    5: 1.8,
  };
  return speeds[threatLevel];
}

export default function AttackBeam({ event, paused, onDone }: Props) {
  const progress = useRef(0);
  const tubeRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);
  const sourceRef = useRef<THREE.Mesh>(null);
  const sourceHaloRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const pulse2Ref = useRef<THREE.Mesh>(null);
  const pulse3Ref = useRef<THREE.Mesh>(null);
  const [landed, setLanded] = useState(false);

  const threatLevel = event.threatLevel || 3;
  const { sourceColor, targetColor, color } = getAttackColors(
    event.attackType,
    threatLevel
  );
  const glowIntensity = getGlowIntensity(threatLevel);
  const animSpeed = getAnimationSpeed(threatLevel);

  // Build arc curve, endpoints, a vertex-colored core tube and a wider glow tube.
  const { curve, source, target, coreGeometry, glowGeometry } = useMemo(() => {
    const s = latLngToVector3(event.sourceLat, event.sourceLng, GLOBE_RADIUS);
    const t = latLngToVector3(event.targetLat, event.targetLng, GLOBE_RADIUS);
    const pts = buildArc(s, t, GLOBE_RADIUS, 80);
    const c = new THREE.CatmullRomCurve3(pts);

    // Tube size varies by threat level
    const coreRadius = 0.008 + threatLevel * 0.002;
    const glowRadius = 0.025 + threatLevel * 0.008;

    const core = new THREE.TubeGeometry(c, 80, coreRadius, 8, false);
    applyGradient(core, sourceColor, targetColor);
    core.setDrawRange(0, 0);

    const glow = new THREE.TubeGeometry(c, 80, glowRadius, 8, false);
    applyGradient(glow, sourceColor, targetColor);
    glow.setDrawRange(0, 0);

    return { curve: c, source: s, target: t, coreGeometry: core, glowGeometry: glow };
  }, [event, threatLevel]);

  useFrame((state, delta) => {
    if (paused) return;
    progress.current += delta / (DURATION / animSpeed);
    const p = Math.min(progress.current, 1);
    const eased = 1 - Math.pow(1 - p, 2); // ease-out

    const coreIdx = coreGeometry.index ? coreGeometry.index.count : 0;
    const glowIdx = glowGeometry.index ? glowGeometry.index.count : 0;
    coreGeometry.setDrawRange(0, Math.floor(eased * coreIdx));
    glowGeometry.setDrawRange(0, Math.floor(eased * glowIdx));

    // Pulsing source node - more intense for higher threat levels
    if (sourceRef.current) {
      const pulseIntensity = 0.15 + threatLevel * 0.05;
      const s = 1 + Math.sin(state.clock.elapsedTime * (6 + threatLevel)) * pulseIntensity;
      sourceRef.current.scale.setScalar(s);
    }

    // Pulsing source halo
    if (sourceHaloRef.current) {
      const haloIntensity = 0.3 + threatLevel * 0.1;
      const opacity = 0.2 + Math.sin(state.clock.elapsedTime * (5 + threatLevel * 0.5)) * haloIntensity;
      (sourceHaloRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(
        0.1,
        opacity
      );
    }

    if (headRef.current) {
      headRef.current.position.copy(curve.getPoint(eased));
      headRef.current.visible = p < 1;
      const hs = 1 + Math.sin(state.clock.elapsedTime * (12 + threatLevel * 2)) * (0.2 + threatLevel * 0.06);
      headRef.current.scale.setScalar(hs);
    }

    if (p >= 1 && !landed) setLanded(true);

    if (landed) {
      const after = progress.current - 1;
      const maxPulseScale = 6 + threatLevel * 2;
      const maxPulseScale2 = 3.5 + threatLevel * 1.5;

      if (pulseRef.current) {
        pulseRef.current.scale.setScalar(1 + after * maxPulseScale);
        (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(
          0,
          0.9 - after * (1.5 + threatLevel * 0.2)
        );
      }

      if (pulse2Ref.current) {
        pulse2Ref.current.scale.setScalar(1 + after * maxPulseScale2);
        (pulse2Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(
          0,
          0.7 - after * (1.1 + threatLevel * 0.15)
        );
      }

      // Third pulse ring for higher threat levels
      if (pulse3Ref.current && threatLevel >= 3) {
        pulse3Ref.current.scale.setScalar(1 + after * (4.5 + threatLevel * 0.8));
        (pulse3Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(
          0,
          0.5 - after * 0.8
        );
      }

      if (after > 0.85) onDone(event.id);
    }
  });

  return (
    <group>
      {/* wide soft glow */}
      <mesh ref={glowRef} geometry={glowGeometry}>
        <meshBasicMaterial
          vertexColors
          transparent
          opacity={glowIntensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* bright core */}
      <mesh ref={tubeRef} geometry={coreGeometry}>
        <meshBasicMaterial
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* source country label */}
      <Html position={source} center distanceFactor={6} zIndexRange={[10, 0]}>
        <div
          className="whitespace-nowrap rounded px-2 py-1 text-[10px] font-bold leading-none backdrop-blur-sm"
          style={{
            backgroundColor: `${color}20`,
            color: color,
            border: `1px solid ${color}`,
            boxShadow: `0 0 10px ${color}40`,
          }}
        >
          {event.sourceCountry}
        </div>
      </Html>

      {/* target country + attack type + threat level label */}
      <Html position={target} center distanceFactor={6} zIndexRange={[10, 0]}>
        <div
          className="flex flex-col items-center gap-1 whitespace-nowrap rounded px-2 py-1.5 leading-none backdrop-blur-sm"
          style={{
            backgroundColor: `${color}15`,
            border: `1.5px solid ${color}`,
            boxShadow: `0 0 15px ${color}50, inset 0 0 10px ${color}20`,
          }}
        >
          <span className="text-[10px] font-medium" style={{ color: '#c7d3e6' }}>
            {event.targetCountry}
          </span>
          <span className="text-[9px] font-bold" style={{ color: color }}>
            {event.attackType}
          </span>
          <span
            className="text-[8px] font-semibold px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: color,
              color: '#000000',
              letterSpacing: '0.5px',
            }}
          >
            {THREAT_LEVEL_NAMES[threatLevel]}
          </span>
        </div>
      </Html>

      {/* source node + halo */}
      <mesh ref={sourceRef} position={source}>
        <sphereGeometry args={[0.03, 14, 14]} />
        <meshBasicMaterial color={sourceColor} />
      </mesh>
      <mesh ref={sourceHaloRef} position={source}>
        <sphereGeometry args={[0.055 + threatLevel * 0.015, 14, 14]} />
        <meshBasicMaterial
          color={sourceColor}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* travelling head with halo */}
      <group ref={headRef}>
        <mesh>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshBasicMaterial color={HEAD_COLOR} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.045 + threatLevel * 0.01, 12, 12]} />
          <meshBasicMaterial
            color={targetColor}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* target node */}
      <mesh position={target}>
        <sphereGeometry args={[0.03, 14, 14]} />
        <meshBasicMaterial color={targetColor} />
      </mesh>

      {/* pulse ripples at target */}
      {landed && (
        <group position={target}>
          <mesh ref={pulseRef} quaternion={ringQuaternion(target)}>
            <ringGeometry args={[0.045, 0.065, 32]} />
            <meshBasicMaterial
              color={targetColor}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh ref={pulse2Ref} quaternion={ringQuaternion(target)}>
            <ringGeometry args={[0.03, 0.05, 32]} />
            <meshBasicMaterial
              color={color === targetColor.getHexString() ? '#ffffff' : color}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {threatLevel >= 3 && (
            <mesh ref={pulse3Ref} quaternion={ringQuaternion(target)}>
              <ringGeometry args={[0.055, 0.075, 32]} />
              <meshBasicMaterial
                color={targetColor}
                transparent
                opacity={0.5}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>
      )}
    </group>
  );
}

// Color the tube vertices from source color at the start to target color at the end.
function applyGradient(
  geo: THREE.TubeGeometry,
  from: THREE.Color,
  to: THREE.Color
) {
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  // TubeGeometry positions are ordered ring by ring along the path.
  const rings = (geo.parameters.tubularSegments ?? 80) + 1;
  const radial = (geo.parameters.radialSegments ?? 8) + 1;
  const tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i += 1) {
    const ring = Math.floor(i / radial);
    const f = ring / (rings - 1);
    tmp.copy(from).lerp(to, f);
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}

// Orient the pulse rings flat against the globe surface at the given point.
function ringQuaternion(point: THREE.Vector3): THREE.Quaternion {
  const normal = point.clone().normalize();
  return new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    normal
  );
}
