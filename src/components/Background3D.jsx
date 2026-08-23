import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

// Floating dust particle field
const ParticleField = ({ scrollProgress }) => {
  const pointsRef = useRef();
  
  const count = 120;
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12; // x range
      pos[i * 3 + 1] = (Math.random() * 24) - 20; // y range (-20 to 4)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8; // z range
      sp[i] = 0.02 + Math.random() * 0.04;
    }
    return [pos, sp];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // Slow background rotation
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.005;
    
    // Smooth camera scroll Y tracking
    const targetCamY = -scrollProgress.current * 14.5;
    state.camera.position.y += (targetCamY - state.camera.position.y) * 0.05;

    // Dynamic curvilinear flight path: swing X and pull Z back/forth based on scroll triggers!
    const isMobile = window.innerWidth <= 992;
    if (!isMobile) {
      // Swing camera left/right along a wavy path as we travel down
      const swingX = Math.sin(scrollProgress.current * Math.PI * 2.5) * 1.5;
      const mouseParallaxX = state.pointer.x * 0.5;
      const targetX = swingX + mouseParallaxX;
      state.camera.position.x += (targetX - state.camera.position.x) * 0.05;

      // Adjust focal distance Z to zoom in and out around architectures
      const targetZ = 4.2 + Math.cos(scrollProgress.current * Math.PI * 3.0) * 0.8;
      state.camera.position.z += (targetZ - state.camera.position.z) * 0.05;
      
      // Look slightly towards active architecture group center
      state.camera.lookAt(new THREE.Vector3(0, targetCamY, -2.5));
    } else {
      // Stationary stable setup for mobile viewports
      state.camera.position.x += (0 - state.camera.position.x) * 0.05;
      state.camera.position.z += (4.6 - state.camera.position.z) * 0.05;
      state.camera.lookAt(new THREE.Vector3(0, targetCamY, -2.5));
    }

    // Slowly drift particles upward
    const positionsArray = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      positionsArray[i * 3 + 1] += speeds[i] * 0.006;
      if (positionsArray[i * 3 + 1] > 4) {
        positionsArray[i * 3 + 1] = -20; // wrap around back to the bottom
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#c5a880"
        size={0.038}
        transparent
        opacity={0.14}
        sizeAttenuation
      />
    </points>
  );
};

// Mini nodes, edges and packets for background topologies
const BgNode = ({ pos, color = "#c5a880" }) => (
  <mesh position={pos}>
    <sphereGeometry args={[0.1, 12, 12]} />
    <meshBasicMaterial color={color} transparent opacity={0.4} />
  </mesh>
);

const BgCylinderNode = ({ pos, color = "#c5a880" }) => (
  <mesh position={pos}>
    <cylinderGeometry args={[0.1, 0.1, 0.22, 12]} />
    <meshBasicMaterial color={color} transparent opacity={0.4} />
  </mesh>
);

const BgEdge = ({ start, end }) => {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  return (
    <Line points={points} color="#c5a880" lineWidth={0.8} transparent opacity={0.15} />
  );
};

const BgPacket = ({ start, end, speed = 0.35, delay = 0 }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = ((clock.getElapsedTime() * speed) + delay) % 1.0;
    ref.current.position.lerpVectors(
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
      t
    );
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.026, 6, 6]} />
      <meshBasicMaterial color="#d4b26f" transparent opacity={0.55} />
    </mesh>
  );
};

// 3 Major Detailed Responsive Microservices Architecture Geometries
const SectionGeometries = () => {
  const mesh1Ref = useRef();
  const mesh2Ref = useRef();
  const mesh3Ref = useRef();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Rotate each architecture topology slowly
    if (mesh1Ref.current) {
      mesh1Ref.current.rotation.y = t * 0.08;
      mesh1Ref.current.rotation.x = Math.sin(t * 0.04) * 0.04;
    }
    if (mesh2Ref.current) {
      mesh2Ref.current.rotation.y = -t * 0.06;
      mesh2Ref.current.rotation.z = Math.cos(t * 0.03) * 0.03;
    }
    if (mesh3Ref.current) {
      mesh3Ref.current.rotation.x = t * 0.05;
      mesh3Ref.current.rotation.y = t * 0.07;
    }
  });

  const scale = isMobile ? 0.65 : 1.0;
  // Center shapes behind text on mobile; offset to the right/left on desktop
  const pos1 = isMobile ? [0, 0, -2.5] : [2.0, 0, -2];
  const pos2 = isMobile ? [0, -7.0, -2.5] : [-2.0, -7.0, -2];
  const pos3 = isMobile ? [0, -14.0, -2.5] : [2.0, -14.0, -2];

  return (
    <group>
      {/* Topology 1: API Gateway request routing mesh (Y = 0) */}
      <group ref={mesh1Ref} position={pos1} scale={[scale, scale, scale]}>
        <BgNode pos={[0, 0.6, 0]} color="#e0a96d" /> {/* API Gateway */}
        <BgNode pos={[-0.9, -0.4, -0.4]} color="#b85a4b" /> {/* Service A (Auth) */}
        <BgNode pos={[0, -0.6, 0.4]} color="#9cad8a" /> {/* Service B (Tickets) */}
        <BgNode pos={[0.9, -0.4, -0.4]} color="#b85a4b" /> {/* Service C (Notification) */}
        
        <BgEdge start={[0, 0.6, 0]} end={[-0.9, -0.4, -0.4]} />
        <BgEdge start={[0, 0.6, 0]} end={[0, -0.6, 0.4]} />
        <BgEdge start={[0, 0.6, 0]} end={[0.9, -0.4, -0.4]} />

        <BgPacket start={[0, 0.6, 0]} end={[-0.9, -0.4, -0.4]} speed={0.3} delay={0} />
        <BgPacket start={[0, 0.6, 0]} end={[0, -0.6, 0.4]} speed={0.3} delay={0.33} />
        <BgPacket start={[0, 0.6, 0]} end={[0.9, -0.4, -0.4]} speed={0.3} delay={0.66} />
      </group>

      {/* Topology 2: Kafka Event Bus Broker & Streams (Y = -7.0) */}
      <group ref={mesh2Ref} position={pos2} scale={[scale, scale, scale]}>
        <BgNode pos={[0, 0, 0]} color="#e0a96d" /> {/* Broker node */}
        <BgNode pos={[-1.0, 0.7, -0.4]} color="#e0a96d" /> {/* Producer A */}
        <BgNode pos={[-1.0, -0.7, 0.4]} color="#9cad8a" /> {/* Producer B */}
        <BgNode pos={[1.0, 0.7, 0.4]} color="#b85a4b" /> {/* Consumer A */}
        <BgNode pos={[1.0, -0.7, -0.4]} color="#b85a4b" /> {/* Consumer B */}

        <BgEdge start={[-1.0, 0.7, -0.4]} end={[0, 0, 0]} />
        <BgEdge start={[-1.0, -0.7, 0.4]} end={[0, 0, 0]} />
        <BgEdge start={[0, 0, 0]} end={[1.0, 0.7, 0.4]} />
        <BgEdge start={[0, 0, 0]} end={[1.0, -0.7, -0.4]} />

        <BgPacket start={[-1.0, 0.7, -0.4]} end={[0, 0, 0]} speed={0.35} delay={0} />
        <BgPacket start={[-1.0, -0.7, 0.4]} end={[0, 0, 0]} speed={0.35} delay={0.5} />
        <BgPacket start={[0, 0, 0]} end={[1.0, 0.7, 0.4]} speed={0.35} delay={0.25} />
        <BgPacket start={[0, 0, 0]} end={[1.0, -0.7, -0.4]} speed={0.35} delay={0.75} />
      </group>

      {/* Topology 3: Database Write-Replication & Caching (Y = -14.0) */}
      <group ref={mesh3Ref} position={pos3} scale={[scale, scale, scale]}>
        <BgCylinderNode pos={[0, 0.6, 0]} color="#e0a96d" /> {/* Primary Database */}
        <BgCylinderNode pos={[0.8, -0.5, -0.4]} color="#9cad8a" /> {/* Secondary DB Replica */}
        <BgNode pos={[-0.8, -0.5, 0.4]} color="#b85a4b" /> {/* Cache layer */}

        <BgEdge start={[0, 0.6, 0]} end={[0.8, -0.5, -0.4]} />
        <BgEdge start={[-0.8, -0.5, 0.4]} end={[0, 0.6, 0]} />

        <BgPacket start={[0, 0.6, 0]} end={[0.8, -0.5, -0.4]} speed={0.25} delay={0} />
        <BgPacket start={[0, 0.6, 0]} end={[0.8, -0.5, -0.4]} speed={0.25} delay={0.5} />
        <BgPacket start={[-0.8, -0.5, 0.4]} end={[0, 0.6, 0]} speed={0.3} delay={0.25} />
      </group>
    </group>
  );
};

// Individual floating wireframe shape container
const FloatingShape = ({ geometry, pos, scale = 1, speed = 1 }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed;
    ref.current.rotation.x = t * 0.12;
    ref.current.rotation.y = t * 0.16;
    // Gentle floating translation drift
    ref.current.position.y = pos[1] + Math.sin(t * 0.5) * 0.25;
  });

  return (
    <mesh ref={ref} position={pos} scale={scale}>
      {geometry}
      <meshBasicMaterial color="#e0a96d" wireframe transparent opacity={0.06} />
    </mesh>
  );
};

// Dispersed collection of floating shapes along the Y axis
const FloatingShapes = () => {
  return (
    <group>
      <FloatingShape 
        geometry={<boxGeometry args={[0.45, 0.45, 0.45]} />} 
        pos={[-2.4, 1.8, -2.5]} 
        scale={1} 
        speed={0.8} 
      />
      <FloatingShape 
        geometry={<torusGeometry args={[0.3, 0.09, 8, 24]} />} 
        pos={[2.4, -3.2, -3]} 
        scale={1.1} 
        speed={0.6} 
      />
      <FloatingShape 
        geometry={<tetrahedronGeometry args={[0.4]} />} 
        pos={[-2.6, -5.5, -2.5]} 
        scale={1} 
        speed={0.9} 
      />
      <FloatingShape 
        geometry={<coneGeometry args={[0.3, 0.6, 6]} />} 
        pos={[2.5, -9.5, -3.2]} 
        scale={0.9} 
        speed={0.7} 
      />
      <FloatingShape 
        geometry={<boxGeometry args={[0.4, 0.4, 0.4]} />} 
        pos={[-2.4, -11.2, -2]} 
        scale={1} 
        speed={0.5} 
      />
      <FloatingShape 
        geometry={<torusGeometry args={[0.3, 0.08, 8, 24]} />} 
        pos={[2.2, -15.8, -2.5]} 
        scale={1} 
        speed={0.8} 
      />
    </group>
  );
};

export default function Background3D() {
  const scrollProgress = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -2, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 4.2], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <ParticleField scrollProgress={scrollProgress} />
        <SectionGeometries />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
