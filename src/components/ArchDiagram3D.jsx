import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Text } from '@react-three/drei';
import * as THREE from 'three';

// Data packet component
const DataPacket = ({ start, end, speed = 0.6, delay = 0 }) => {
  const meshRef = useRef();
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = ((clock.getElapsedTime() * speed) + delay) % 1.0;
    meshRef.current.position.lerpVectors(
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
      t
    );
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#d4b26f" toneMapped={false} />
    </mesh>
  );
};

// Node component with label
const Node3D = ({ pos, name, color, type }) => {
  const meshRef = useRef();
  const textRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      // Floating motion
      meshRef.current.position.y = pos[1] + Math.sin(t + pos[0] * 3) * 0.04;
    }
    if (textRef.current) {
      // Billboard the text
      textRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  // Render different shapes depending on node type
  const renderGeometry = () => {
    if (type === "server") {
      // spring boot monolith big box
      return <boxGeometry args={[1.0, 0.7, 0.6]} />;
    }
    if (type === "db" || type === "cache") {
      // Cylinder for databases
      return <cylinderGeometry args={[0.25, 0.25, 0.5, 16]} />;
    }
    // Default sphere
    return <sphereGeometry args={[0.18, 16, 16]} />;
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        position={pos}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {renderGeometry()}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.4 : 0.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Label */}
      <Text
        ref={textRef}
        position={[pos[0], pos[1] + 0.45, pos[2]]}
        fontSize={0.16}
        color="#f4f1ea"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
};

// Connections/Lines between nodes
const Edge3D = ({ start, end }) => {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  return (
    <Line
      points={points}
      color="#d4b26f"
      lineWidth={1.2}
      transparent
      opacity={0.35}
    />
  );
};

// Microservices topology
const MicroservicesScene = () => {
  const NODES = [
    { name: "Client (HTTP/WS)", pos: [0, 1.8, 0], color: "#d4b26f" },
    { name: "Nginx API Gateway", pos: [0, 0.8, 0], color: "#c5a880" },
    { name: "Auth Service", pos: [-1.4, 0, 0], color: "#b36b5c" },
    { name: "Ticket Core Service", pos: [0, -0.4, 0], color: "#768a7e", type: "server" },
    { name: "WebSocket Notify", pos: [1.4, 0, 0], color: "#b37d82" },
    { name: "Redis Cache Layer", pos: [-1.4, -1.2, 0], color: "#b8860b", type: "cache" },
    { name: "Kafka Event Broker", pos: [1.4, -1.2, 0], color: "#a39f96" },
    { name: "MySQL DB Cluster", pos: [0, -2.2, 0], color: "#c2b29c", type: "db" }
  ];

  const EDGES = [
    { from: [0, 1.8, 0], to: [0, 0.8, 0] },
    { from: [0, 0.8, 0], to: [-1.4, 0, 0] },
    { from: [0, 0.8, 0], to: [0, -0.4, 0] },
    { from: [0, 0.8, 0], to: [1.4, 0, 0] },
    { from: [0, -0.4, 0], to: [-1.4, -1.2, 0] },
    { from: [0, -0.4, 0], to: [1.4, -1.2, 0] },
    { from: [1.4, -1.2, 0], to: [1.4, 0, 0] },
    { from: [0, -0.4, 0], to: [0, -2.2, 0] },
    { from: [-1.4, 0, 0], to: [0, -2.2, 0] }
  ];

  return (
    <group position={[0, 0.3, 0]}>
      {EDGES.map((edge, idx) => (
        <React.Fragment key={`edge-${idx}`}>
          <Edge3D start={edge.from} end={edge.to} />
          <DataPacket start={edge.from} end={edge.to} speed={0.3} delay={0} />
          <DataPacket start={edge.from} end={edge.to} speed={0.3} delay={0.5} />
        </React.Fragment>
      ))}
      {NODES.map((node, idx) => (
        <Node3D
          key={idx}
          pos={node.pos}
          name={node.name}
          color={node.color}
          type={node.type}
        />
      ))}
    </group>
  );
};

// Monolith topology
const MonolithScene = () => {
  const NODES = [
    { name: "Client Browser", pos: [0, 1.4, 0], color: "#d4b26f" },
    { name: "Spring Boot Monolith", pos: [0, -0.1, 0], color: "#768a7e", type: "server" },
    { name: "Redis Token Cache", pos: [-1.6, -1.4, 0], color: "#b37d82", type: "cache" },
    { name: "MySQL database", pos: [1.6, -1.4, 0], color: "#c2b29c", type: "db" }
  ];

  const EDGES = [
    { from: [0, 1.4, 0], to: [0, -0.1, 0] },
    { from: [0, -0.1, 0], to: [-1.6, -1.4, 0] },
    { from: [0, -0.1, 0], to: [1.6, -1.4, 0] }
  ];

  return (
    <group position={[0, 0.1, 0]}>
      {EDGES.map((edge, idx) => (
        <React.Fragment key={`edge-${idx}`}>
          <Edge3D start={edge.from} end={edge.to} />
          <DataPacket start={edge.from} end={edge.to} speed={0.3} delay={0} />
          <DataPacket start={edge.from} end={edge.to} speed={0.3} delay={0.5} />
        </React.Fragment>
      ))}
      {NODES.map((node, idx) => (
        <Node3D
          key={idx}
          pos={node.pos}
          name={node.name}
          color={node.color}
          type={node.type}
        />
      ))}
    </group>
  );
};

export default function ArchDiagram3D({ type }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '320px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 4.0], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {type === "microservices" ? <MicroservicesScene /> : <MonolithScene />}
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxDistance={5.5}
          minDistance={3.0}
        />
      </Canvas>
    </div>
  );
}
