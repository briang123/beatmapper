import React from 'react';
import * as THREE from 'three';
import { useSpring, animated } from 'react-spring/three';

import useOnChange from '../../hooks/use-on-change.hook';

import { getSpringConfigForLight } from './Preview.helpers';

const ON_PROPS = { emissiveIntensity: 0.75, opacity: 0.75 };
const OFF_PROPS = { emissiveIntensity: 0, opacity: 0 };
const BRIGHT_PROPS = { emissiveIntensity: 1, opacity: 1 };

const RingPeg = ({
  size,
  thickness,
  color,
  zRotation,
  lightStatus,
  lightColor,
  lastLightingEventId,
  isPlaying,
}) => {
  const length = size;
  const width = thickness * 2;

  let lightSpringConfig = getSpringConfigForLight(
    [ON_PROPS, OFF_PROPS, BRIGHT_PROPS],
    lightStatus,
    isPlaying
  );

  useOnChange(() => {
    const statusShouldReset = lightStatus === 'flash' || lightStatus === 'fade';

    lightSpringConfig.reset = statusShouldReset;
  }, lastLightingEventId);

  const spring = useSpring(lightSpringConfig);

  return (
    <group rotation={[0, 0, zRotation]}>
      <mesh position={[0, length / 2 - width / 2, 0]}>
        <boxGeometry attach="geometry" args={[length, width, thickness]} />
        <meshLambertMaterial attach="material" color={color} />
      </mesh>

      <mesh
        position={[0, length / 2 - width / 2 - thickness - 0.1, 0]}
        rotation={[Math.PI * 0.5, 0, 0]}
      >
        <planeGeometry
          attach="geometry"
          args={[length * 0.3, thickness * 0.25]}
        />
        <animated.meshLambertMaterial
          attach="material"
          emissive={lightColor}
          transparent={true}
          side={THREE.DoubleSide}
          {...spring}
        />
      </mesh>
    </group>
  );
};

const LitSquareRing = ({
  size = 12,
  thickness,
  x = 0,
  y = -2,
  z = -8,
  rotation = 0,
  color,
  lightStatus,
  lightColor,
  lastLightingEventId,
  isPlaying,
}) => {
  // Each ring consists of 4 identical pegs, long thick bars with a light
  // pointing inwards

  const movementSpring = useSpring({
    to: {
      position: [x, y, z],
      rotation: [0, 0, rotation],
    },
    config: {
      tension: 2500,
      friction: 1700,
      mass: 20,
    },
  });

  const zRotations = [0, Math.PI * 0.5, Math.PI * 1, Math.PI * 1.5];

  return (
    <animated.group rotation={[0, 0, rotation]} {...movementSpring}>
      {zRotations.map(zRotation => (
        <RingPeg
          key={zRotation}
          size={size}
          thickness={thickness}
          color={color}
          zRotation={zRotation}
          lightStatus={lightStatus}
          lightColor={lightColor}
          lastLightingEventId={lastLightingEventId}
          isPlaying={isPlaying}
        />
      ))}
    </animated.group>
  );
};

export default LitSquareRing;
