import { useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { TextureLoader } from 'three'

function Earth() {
  const meshRef = useRef()

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        color="#F97316"
        emissive="#F97316"
        emissiveIntensity={0.2}
        roughness={0.7}
        metalness={0.3}
      />
      {/* Green landmasses effect */}
      <mesh>
        <sphereGeometry args={[2.01, 32, 32]} />
        <meshStandardMaterial
          color="#22C55E"
          transparent
          opacity={0.3}
          roughness={0.9}
        />
      </mesh>
    </mesh>
  )
}

function Atmosphere() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.3, 64, 64]} />
      <meshStandardMaterial
        color="#F97316"
        transparent
        opacity={0.15}
        roughness={1}
        wireframe
      />
    </mesh>
  )
}

const EarthAnimation = () => {
  return (
    <div className="w-full h-[600px] relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={['#030712']} />
        
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#14B8A6" />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />

        <Earth />
        <Atmosphere />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI - Math.PI / 3}
        />
      </Canvas>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Protect Our <span className="text-primary">Planet</span>
        </h2>
        <p className="text-textLight/70">Every action counts in fighting climate change</p>
      </div>
    </div>
  )
}

export default EarthAnimation
