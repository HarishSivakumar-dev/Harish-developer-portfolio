import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import './Network3D.css';

const NODES = [
  { id: 'gateway', name: 'API Gateway (Nginx & Docker)', pos: [0, 1.8, 0], color: '#c5a880', details: 'Reverse proxy, JWT verification, rate limiting, and request routing.' },
  { id: 'auth', name: 'Auth Microservice', pos: [-2, 0.5, -0.8], color: '#b36b5c', details: 'Spring Security, Role-Based Access Control (RBAC), and stateless JWT issuance.' },
  { id: 'tickit', name: 'Tick-It Platform', pos: [-0.8, 0, 1.8], color: '#768a7e', details: 'Core ticket management service supporting 10k+ concurrent users, integrated with WebSockets.' },
  { id: 'skillsprint', name: 'SkillSprint Engine', pos: [1.8, 0.2, 0.8], color: '#b8860b', details: 'Spring Boot monolith for quiz tracking, JWT validation, and RBAC securing 5k+ concurrent users.' },
  { id: 'kafka', name: 'Kafka Event Broker', pos: [0.8, -1.2, -1.8], color: '#8fa499', details: 'Asynchronous event stream for microservice communication, reducing message latency.' },
  { id: 'redis', name: 'Redis Cache Layer', pos: [-1.4, -0.8, 0.4], color: '#b37d82', details: 'Distributed memory caching and real-time state store with <150ms retrieval latencies.' },
  { id: 'mysql', name: 'MySQL DB Cluster', pos: [0.2, -2.0, 1.0], color: '#c2b29c', details: 'Relational database layer configured with JPA/Hibernate for transaction management.' }
];

const EDGES = [
  { from: 'gateway', to: 'auth' },
  { from: 'gateway', to: 'tickit' },
  { from: 'gateway', to: 'skillsprint' },
  { from: 'tickit', to: 'kafka' },
  { from: 'tickit', to: 'redis' },
  { from: 'skillsprint', to: 'redis' },
  { from: 'kafka', to: 'mysql' },
  { from: 'redis', to: 'mysql' },
  { from: 'auth', to: 'mysql' }
];

// Moving glowing data packets
const Packet = ({ start, end, speed = 0.5, delay = 0 }) => {
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
      <sphereGeometry args={[0.07, 8, 8]} />
      <meshBasicMaterial color="#d4b26f" toneMapped={false} />
    </mesh>
  );
};

// Connective lines
const Connection = ({ start, end, isHighlighted }) => {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);

  return (
    <Line
      points={points}
      color={isHighlighted ? "#d4b26f" : "#1e293b"}
      lineWidth={isHighlighted ? 2.5 : 1}
      transparent
      opacity={isHighlighted ? 0.8 : 0.25}
    />
  );
};

// Glowing 3D node
const NetworkNode = ({ pos, color, isHovered, onHover, onUnhover }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = pos[1] + Math.sin(t + pos[0] * 2) * 0.05;
    const targetScale = isHovered ? 1.3 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
  });

  return (
    <mesh
      ref={meshRef}
      position={pos}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        onHover();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
        onUnhover();
      }}
    >
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isHovered ? 1.6 : 0.4}
        roughness={0.25}
        metalness={0.8}
      />
    </mesh>
  );
};

// Ambient background floating star field
const SpaceDust = ({ count = 80 }) => {
  const groupRef = useRef();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      temp.push([x, y, z]);
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.015, 4, 4]} />
          <meshBasicMaterial color="#ffffff" opacity={0.2} transparent />
        </mesh>
      ))}
    </group>
  );
};

const NetworkScene = ({ hoveredId, setHoveredId }) => {
  // Find nodes by ID for drawing connections
  const nodeMap = useMemo(() => {
    const map = {};
    NODES.forEach(n => { map[n.id] = n; });
    return map;
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <SpaceDust />

      {/* Render Edges */}
      {EDGES.map((edge, idx) => {
        const startNode = nodeMap[edge.from];
        const endNode = nodeMap[edge.to];
        if (!startNode || !endNode) return null;

        const isHighlighted = hoveredId === edge.from || hoveredId === edge.to;
        return (
          <React.Fragment key={`edge-${idx}`}>
            <Connection start={startNode.pos} end={endNode.pos} isHighlighted={isHighlighted} />
            {/* Draw packet moving start -> end */}
            <Packet start={startNode.pos} end={endNode.pos} speed={0.4} delay={0} />
            {/* Draw secondary packet with offset delay for fluid network vibe */}
            <Packet start={startNode.pos} end={endNode.pos} speed={0.4} delay={0.5} />
          </React.Fragment>
        );
      })}

      {/* Render Nodes */}
      {NODES.map((node) => (
        <NetworkNode
          key={node.id}
          pos={node.pos}
          color={node.color}
          isHovered={hoveredId === node.id}
          onHover={() => setHoveredId(node.id)}
          onUnhover={() => setHoveredId(null)}
        />
      ))}

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        maxDistance={6.5}
        minDistance={3.5}
        autoRotate={!hoveredId}
        autoRotateSpeed={0.8}
      />
    </>
  );
};

export default function Network3D() {
  const [hoveredId, setHoveredId] = useState(null);

  const selectedNode = useMemo(() => {
    return NODES.find(n => n.id === hoveredId);
  }, [hoveredId]);

  return (
    <div className="canvas-container">
      <div className="canvas-instructions">Drag to rotate • Scroll to zoom</div>

      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <NetworkScene hoveredId={hoveredId} setHoveredId={setHoveredId} />
      </Canvas>

      <div className={`canvas-overlay ${selectedNode ? 'active' : ''}`}>
        {selectedNode && (
          <>
            <div className="overlay-title">{selectedNode.name}</div>
            <div className="overlay-desc">{selectedNode.details}</div>
          </>
        )}
      </div>
    </div>
  );
}

const DataMeshWave = ({ position, rotation }) => {
  const geomRef = useRef();

  useFrame((state) => {
    if (!geomRef.current) return;
    const t = state.clock.getElapsedTime();
    const pos = geomRef.current.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Fluid undulating waves using sine/cosine interactions
      const z = Math.sin(x * 0.5 + t * 0.75) * Math.cos(y * 0.5 + t * 0.75) * 0.32;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry ref={geomRef} args={[15, 15, 12, 12]} />
      <meshBasicMaterial color="#e0a96d" wireframe transparent opacity={0.08} />
    </mesh>
  );
};

const BlinkingLed = ({ position, color }) => {
  const meshRef = useRef();
  const freq = useMemo(() => 0.8 + Math.random() * 1.6, []);
  const phase = useMemo(() => Math.random() * Math.PI, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const opacity = Math.sin(t * freq + phase) > 0.2 ? 0.95 : 0.15;
    meshRef.current.material.opacity = opacity;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.015, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  );
};

const ServerNode = ({ pos }) => {
  const meshRef = useRef();
  const initialY = pos[1];
  const initialX = pos[0];
  const floatOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Micro floating drift inside the rotating mesh coordinate space
    meshRef.current.position.y = initialY + Math.sin(t * 0.8 + floatOffset) * 0.04;
    meshRef.current.position.x = initialX + Math.cos(t * 0.6 + floatOffset) * 0.03;
  });

  return (
    <group ref={meshRef} position={[pos[0], pos[1], pos[2]]}>
      {/* Server Rack Box */}
      <mesh>
        <boxGeometry args={[0.35, 0.46, 0.24]} />
        <meshBasicMaterial color="#141519" transparent opacity={0.85} />
      </mesh>

      {/* Wireframe Outline */}
      <mesh>
        <boxGeometry args={[0.352, 0.462, 0.242]} />
        <meshBasicMaterial color="#e0a96d" wireframe transparent opacity={0.16} />
      </mesh>

      {/* Heartbeat Status LEDs */}
      <BlinkingLed position={[-0.09, 0.14, 0.122]} color="#9cad8a" />
      <BlinkingLed position={[0, 0.14, 0.122]} color="#e0a96d" />
      <BlinkingLed position={[0.09, 0.14, 0.122]} color="#9cad8a" />

      {/* Extra rack styling lines on the face */}
      <mesh position={[0, -0.05, 0.122]}>
        <boxGeometry args={[0.22, 0.015, 0.01]} />
        <meshBasicMaterial color="#4f535c" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, -0.14, 0.122]}>
        <boxGeometry args={[0.22, 0.015, 0.01]} />
        <meshBasicMaterial color="#4f535c" transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

const ServerEdge = ({ start, end }) => {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  return (
    <Line points={points} color="#c5a880" lineWidth={0.8} transparent opacity={0.15} />
  );
};

const ServerPacket = ({ start, end, speed = 0.35, delay = 0 }) => {
  const ref = useRef();
  const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
  const endVec = useMemo(() => new THREE.Vector3(...end), [end]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = ((clock.getElapsedTime() * speed) + delay) % 1.0;
    ref.current.position.lerpVectors(startVec, endVec, t);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.026, 6, 6]} />
      <meshBasicMaterial color="#d4b26f" transparent opacity={0.55} />
    </mesh>
  );
};

const ServerMesh = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Rotate slowly to show 3D depth of servers
    groupRef.current.rotation.y = t * 0.08;
    groupRef.current.rotation.x = Math.sin(t * 0.04) * 0.04;
    // Slow float
    groupRef.current.position.y = Math.sin(t * 0.3) * 0.12;
  });

  const nodes = [
    { id: 'balancer', pos: [0, 0, 0] },
    { id: 'auth', pos: [-1.2, 0.6, -0.5] },
    { id: 'router', pos: [1.2, 0.6, 0.5] },
    { id: 'db', pos: [-0.8, -0.8, 0.8] },
    { id: 'broker', pos: [0.8, -0.8, -0.8] }
  ];

  const edges = [
    { from: [0, 0, 0], to: [-1.2, 0.6, -0.5] },
    { from: [0, 0, 0], to: [1.2, 0.6, 0.5] },
    { from: [-1.2, 0.6, -0.5], to: [-0.8, -0.8, 0.8] },
    { from: [1.2, 0.6, 0.5], to: [0.8, -0.8, -0.8] },
    { from: [-0.8, -0.8, 0.8], to: [0.8, -0.8, -0.8] },
    { from: [-1.2, 0.6, -0.5], to: [1.2, 0.6, 0.5] }
  ];

  return (
    <group ref={groupRef} position={[0, 0, -0.8]} scale={[1.15, 1.15, 1.15]}>
      {/* Connection Edges and moving data traffic packets */}
      {edges.map((edge, idx) => (
        <React.Fragment key={`s-edge-${idx}`}>
          <ServerEdge start={edge.from} end={edge.to} />
          <ServerPacket start={edge.from} end={edge.to} speed={0.4} delay={idx * 0.15} />
          <ServerPacket start={edge.to} end={edge.from} speed={0.4} delay={idx * 0.15 + 0.3} />
        </React.Fragment>
      ))}

      {/* Server Rack Nodes */}
      {nodes.map((node) => (
        <ServerNode key={node.id} pos={node.pos} />
      ))}
    </group>
  );
};

export function NetworkBackgroundCanvas() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: 0.5 }}>
      <Canvas camera={{ position: [0, 0, 4.5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        {/* Tilted bottom grid (infrastructure mesh) */}
        <DataMeshWave position={[0, -2.1, -1]} rotation={[-Math.PI / 2.1, 0, Math.PI / 6]} />

        {/* 3D Server Mesh representing backend systems in the middle */}
        <ServerMesh />

        {/* Tilted top grid (application network mesh) */}
        <DataMeshWave position={[0, 2.1, -1]} rotation={[Math.PI / 2.1, 0, Math.PI / 6]} />
      </Canvas>
    </div>
  );
}
