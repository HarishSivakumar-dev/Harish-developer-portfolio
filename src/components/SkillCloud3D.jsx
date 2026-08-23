import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

const ALL_TAGS = [
  // Languages
  { name: "Java", category: "languages" },
  { name: "SQL", category: "languages" },
  { name: "Python", category: "languages" },
  { name: "HTML & CSS", category: "languages" },
  // Frameworks
  { name: "Spring Boot", category: "frameworks" },
  { name: "Spring MVC", category: "frameworks" },
  { name: "Spring Security", category: "frameworks" },
  { name: "Spring Data JPA", category: "frameworks" },
  { name: "Apache Kafka", category: "frameworks" },
  { name: "Spring AI", category: "frameworks" },
  // DevOps
  { name: "Docker", category: "devops" },
  { name: "Redis", category: "devops" },
  { name: "Nginx", category: "devops" },
  { name: "AWS EC2", category: "devops" },
  { name: "OpenSSH", category: "devops" },
  // Tools
  { name: "Postman", category: "tools" },
  { name: "Git & GitHub", category: "tools" },
  { name: "Spring Tool Suite", category: "tools" },
  { name: "MySQL Workbench", category: "tools" }
];

const Tag = ({ name, basePos, isHighlighted, isDimmed }) => {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const currentPos = useRef(new THREE.Vector3(...basePos));

  useFrame((state) => {
    if (ref.current) {
      // Make text face the camera (billboarding)
      ref.current.quaternion.copy(state.camera.quaternion);

      // Lerp position based on highlights (dynamic implode/explode physics!)
      const targetPos = new THREE.Vector3(...basePos);
      if (isHighlighted) {
        // Explode outward and float closer to screen
        targetPos.multiplyScalar(1.25);
      } else if (isDimmed) {
        // Implode inward to the core of the cloud
        targetPos.multiplyScalar(0.55);
      }
      
      currentPos.current.lerp(targetPos, 0.08);
      ref.current.position.copy(currentPos.current);
    }
  });

  const getTagColor = () => {
    if (isHighlighted) {
      return hovered ? "#f4f1ea" : "#d4b26f"; // Gold/White highlight
    }
    if (isDimmed) {
      return hovered ? "rgba(163, 159, 150, 0.3)" : "rgba(110, 107, 100, 0.12)"; // Faded core
    }
    return hovered ? "#f4f1ea" : "#a39f96"; // Standard
  };

  return (
    <Text
      ref={ref}
      position={basePos}
      fontSize={isHighlighted ? 0.32 : isDimmed ? 0.20 : 0.26}
      color={getTagColor()}
      anchorX="center"
      anchorY="middle"
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      {name}
    </Text>
  );
};

const TagCloud = ({ activeCategory }) => {
  const groupRef = useRef();
  const count = ALL_TAGS.length;

  const points = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y); // radius at y
      const theta = 2.399963229728653 * i; // golden angle
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const scale = 2.0; // cloud sphere scale
      temp.push({
        ...ALL_TAGS[i],
        pos: [x * scale, y * scale, z * scale]
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.04) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {points.map((tag, idx) => {
        const isHighlighted = activeCategory === tag.category;
        const isDimmed = activeCategory && activeCategory !== tag.category;
        return (
          <Tag
            key={idx}
            name={tag.name}
            basePos={tag.pos}
            isHighlighted={isHighlighted}
            isDimmed={isDimmed}
          />
        );
      })}
    </group>
  );
};

export default function SkillCloud3D({ activeCategory }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '350px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 4.2], fov: 60 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <TagCloud activeCategory={activeCategory} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
