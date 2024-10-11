import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
  euler,
  InstancedRigidBodies,
  InstancedRigidBodyProps,
  Physics,
  RapierRigidBody,
  RigidBody,
  vec3,
} from "@react-three/rapier";
import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FinalScene = () => {
  const [speed, setSpeed] = useState<number>(3);

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") setSpeed(speed + 1);
    if (e.key === "ArrowDown") setSpeed(speed - 1);
  });

  const [hitSound] = useState(() => new Audio("/hit.mp3"));

  const cubesCount = 100;

  const instances = useMemo(() => {
    const inst: InstancedRigidBodyProps[] = [];

    for (let i = 0; i < cubesCount; i++) {
      const scaleFactor = Math.random();
      inst.push({
        key: "cube_instance_" + i,
        position: vec3({
          x: Math.random() - 0.5 * 8,
          y: 6 + i,
          z: Math.random() - 0.5 * 8,
        }),
        rotation: euler({
          x: 0,
          y: 0,
          z: 0,
        }),
        scale: vec3({
          x: scaleFactor,
          y: scaleFactor,
          z: scaleFactor,
        }),
      });
    }

    return inst;
  }, []);

  const twister = useRef<RapierRigidBody>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const eulerRotation = new THREE.Euler(0, time * speed, 0);
    const quaternionRotation = new THREE.Quaternion().setFromEuler(
      eulerRotation
    );

    if (twister.current)
      twister.current.setNextKinematicRotation(quaternionRotation);

    const angle = time;
    const x = Math.cos(angle) * 2.5;
    const z = Math.sin(angle) * 2.5;

    if (twister.current)
      twister.current.setNextKinematicTranslation({ x, y: -0.8, z });
  });

  const collisionEnter = () => {
    hitSound.currentTime = 0;
    hitSound.volume = Math.random();
    hitSound.play();
  };

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />
      <PerspectiveCamera makeDefault position={[10, 5, 10]} />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <Physics>
        <RigidBody
          ref={twister}
          friction={0}
          position={[0, -0.8, 0]}
          type="kinematicPosition"
          onCollisionEnter={collisionEnter}
        >
          <mesh castShadow scale={[0.4, 0.4, 3]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed" restitution={0.5}>
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10.5, 0.5, 10.5]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
          <mesh receiveShadow position-z={-5} rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[10, 0.5, 2]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
          <mesh receiveShadow position-z={5} rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[10, 0.5, 2]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
          <mesh
            receiveShadow
            position-x={-5}
            rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          >
            <boxGeometry args={[10.5, 0.5, 2]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
          <mesh
            receiveShadow
            position-x={5}
            rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          >
            <boxGeometry args={[10.5, 0.5, 2]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>

        <InstancedRigidBodies colliders="ball" instances={instances}>
          <instancedMesh
            castShadow
            receiveShadow
            args={[undefined, undefined, cubesCount]}
          >
            <sphereGeometry />
            <meshStandardMaterial color="mediumpurple" />
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>
    </>
  );
};

export { FinalScene };
