import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Cone, Cylinder } from '@react-three/drei'

function Tree({ position, scale = 1 }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Trunk */}
      <Cylinder args={[0.1, 0.15, 0.8, 8]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </Cylinder>

      {/* Leaves - Bottom */}
      <Cone args={[0.5, 0.8, 8]} position={[0, 1.2, 0]}>
        <meshStandardMaterial color="#228B22" roughness={0.6} />
      </Cone>

      {/* Leaves - Middle */}
      <Cone args={[0.4, 0.7, 8]} position={[0, 1.6, 0]}>
        <meshStandardMaterial color="#32CD32" roughness={0.6} />
      </Cone>

      {/* Leaves - Top */}
      <Cone args={[0.3, 0.6, 8]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#22C55E" roughness={0.6} />
      </Cone>
    </group>
  )
}

const TreeCounter3D = ({ treesNeeded = 40 }) => {
  const displayTrees = Math.min(treesNeeded, 12) // Limit display for performance

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-b from-orange-200 to-green-100 rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 3, 8], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#FFF8DC" />
        <hemisphereLight skyColor="#87CEEB" groundColor="#90EE90" intensity={0.5} />

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#90EE90" roughness={0.8} />
        </mesh>

        {/* Trees */}
        {Array.from({ length: displayTrees }).map((_, i) => {
          const row = Math.floor(i / 4)
          const col = i % 4
          return (
            <Tree
              key={i}
              position={[
                (col - 1.5) * 1.5,
                0,
                (row - 1) * 2
              ]}
              scale={0.8 + Math.random() * 0.4}
            />
          )
        })}
      </Canvas>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center bg-white/90 px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm">
        <div className="text-3xl font-bold text-green-600">{treesNeeded}</div>
        <div className="text-sm text-gray-700">Trees Needed to Offset</div>
      </div>
    </div>
  )
}

export default TreeCounter3D
