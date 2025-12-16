import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Box3, Vector3, Color, Fog } from 'three'

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import './index.css'

useGLTF.preload('/axolotl.glb')
useGLTF.preload('/low_poly_rock_cave.glb')
useGLTF.preload('/present.glb')
useGLTF.preload('/slide.glb')
useGLTF.preload('/low_poly_bird.glb')



function Present({ npcPos }) {
  const { scene } = useGLTF('/present.glb')
  const model = useMemo(() => scene.clone(true), [scene])

  return (
    <primitive
      object={model}
      position={[npcPos[0] + 1.2, 0.4, npcPos[2] + 0.5]}
      scale={0.02}   // 👈 smaller present
    />
  )
}

function Slide({ pondPos }) {
  const { scene } = useGLTF('/slide.glb')
  const model = useMemo(() => scene.clone(true), [scene])

  return (
    <primitive
      object={model}
      position={[pondPos[0], 0, pondPos[2] - 4]}
      scale={0.6}
    />
  )
}





function Axolotl({ pos, rotY }) {
  const { scene } = useGLTF('/axolotl.glb')
  const model = useMemo(() => scene.clone(true), [scene])

  return (
    <primitive
      object={model}
      position={[pos[0], 1.1, pos[2]]}
      rotation={[0, rotY, 0]}
      scale={0.5}
    />
  )
}

function NPCAxolotl({ pos, playerPos }) {
  const { scene } = useGLTF('/axolotl.glb')
  const model = useMemo(() => scene.clone(true), [scene])
  const ref = useRef()

  useEffect(() => {
    if (!ref.current) return
    const dx = playerPos[0] - pos[0]
    const dz = playerPos[2] - pos[2]
    ref.current.rotation.y = Math.atan2(dx, dz) - Math.PI / 5
  }, [])

  return (
    <group ref={ref} position={[pos[0], 1.1, pos[2]]}>
      <primitive object={model} scale={0.5} />
    </group>
  )
}

function Cave({ position, playerPos }) {
  const { scene } = useGLTF('/low_poly_rock_cave.glb')
  const model = useMemo(() => scene.clone(true), [scene])
  const root = useRef()
  const mesh = useRef()
  const ready = useRef(false)

  useFrame(() => {
    if (!mesh.current || ready.current) return
    if (mesh.current.children.length === 0) return

    const box = new Box3().setFromObject(mesh.current)
    const size = new Vector3()
    box.getSize(size)
    if (size.y === 0) return

    mesh.current.scale.setScalar(4.5 / size.y)
    box.setFromObject(mesh.current)
    mesh.current.position.y -= box.min.y + 1.2

    const dx = playerPos[0] - position[0]
    const dz = playerPos[2] - position[2]
    root.current.rotation.y =
      Math.atan2(dx, dz) + Math.PI / 2 + Math.PI / 6

    ready.current = true
  })

  return (
    <group ref={root} position={position}>
      <primitive ref={mesh} object={model} />
    </group>
  )
}

function Tree({ position, scale }) {
  const ref = useRef()

  // random sway per tree
  const swaySpeed = useMemo(() => 0.3 + Math.random() * 0.5, [])
  const swayAmount = useMemo(() => 0.03 + Math.random() * 0.03, [])
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.z =
      Math.sin(t * swaySpeed + offset) * swayAmount
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 1.5, 8]} />
        <meshStandardMaterial color="#6b3e26" />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <coneGeometry args={[1.2, 3, 8]} />
        <meshStandardMaterial color="#1f6b3a" />
      </mesh>
    </group>
  )
}


function Fireflies({ center, intensity }) {
  const flies = useRef(
    [...Array(25)].map(() => [
      center[0] + (Math.random() - 0.5) * 4,
      center[1] + Math.random() * 2,
      center[2] + (Math.random() - 0.5) * 4
    ])
  )

  return flies.current.map((p, i) => (
    <mesh key={i} position={p}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial
        emissive="#ffe066"
        emissiveIntensity={intensity}
        color="#fff3b0"
      />
    </mesh>
  ))
}

function SunMoon({ mix }) {
  const angle = mix * Math.PI * 2
  const radius = 25

  const y = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius

  // 🌅 Only show when above horizon
  if (y < -1) return null

  const isNight = y < 3

  return (
    <mesh position={[0, y, z]}>
      <sphereGeometry args={[1.5, 16, 16]} />
      <meshStandardMaterial
        emissive={isNight ? '#cfd9ff' : '#fff2a8'}
        emissiveIntensity={1}
        color={isNight ? '#dbe2ff' : '#ffd84d'}
      />
    </mesh>
  )
}


function SceneController({ night, setMix }) {
  useFrame(() => {
    setMix(m =>
      Math.min(1, Math.max(0, m + (night ? 0.01 : -0.01)))
    )
  })
  return null
}

function CameraFollow({ pos }) {
  useFrame(({ camera }) => {
    camera.position.lerp(new Vector3(pos[0], 4, pos[2] + 8), 0.08)
    camera.lookAt(pos[0], 1, pos[2])
  })
  return null
}

function Birds({ count = 6 }) {
  const { scene } = useGLTF('/low_poly_bird.glb')

  const birds = useRef(
    [...Array(count)].map(() => ({
      angle: Math.random() * Math.PI * 2,
      speed: 0.002 + Math.random() * 0.002,
      flap: Math.random() * Math.PI * 2,
      ref: null
    }))
  )

  useFrame(() => {
    birds.current.forEach(b => {
      if (!b.ref) return

      /* ===== FLIGHT PATH ===== */
      b.angle += b.speed
      b.flap += 0.25   // 👈 flap speed (VERY visible)

      const radius = 10
      const height = 5

      const x = Math.cos(b.angle) * radius
      const z = Math.sin(b.angle) * radius
      const y = height + Math.sin(b.angle * 2) * 0.3

      b.ref.position.set(x, y, z)
      b.ref.rotation.y = -b.angle 

      /* ===== FAKE FLAP (BODY MOTION) ===== */
      const flap = Math.sin(b.flap)

      // pitch up/down (like flapping)
      b.ref.rotation.x = flap * 0.35   // 👈 VERY noticeable

      // squash/stretch body
      b.ref.scale.set(
        1.5,
        1.5 + flap * 0.25,
        1.5 - flap * 0.1
      )
    })
  })

  return birds.current.map((b, i) => (
    <group key={i} ref={el => (b.ref = el)}>
      <primitive object={scene.clone(true)} />
    </group>
  ))
}

function NightFog({ mix }) {
  const fogRef = useRef()

  useFrame(() => {
    if (!fogRef.current) return

    fogRef.current.color.lerpColors(
      new Color('#9fd3ff'),   // day fog
      new Color('#0b1026'),   // night fog
      mix
    )
  })

  return <fog ref={fogRef} attach="fog" args={['#9fd3ff', 25, 80]} />
}

function AmbientSound({ night }) {
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = new Audio('/forestsound.mp3')
    audio.loop = true
    audio.volume = 0.4
    audioRef.current = audio

    const startAudio = () => {
      audio.play().catch(() => {})
      window.removeEventListener('click', startAudio)
      window.removeEventListener('keydown', startAudio)
    }

    // browser requires user interaction
    window.addEventListener('click', startAudio)
    window.addEventListener('keydown', startAudio)

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  // 🌙 slightly quieter at night
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = night ? 0.25 : 0.4
  }, [night])

  return null
}








export default function App() {
  const [pos, setPos] = useState([0, 0, 0])
  const [rotY, setRotY] = useState(Math.PI)
  const [night, setNight] = useState(false)
  const [mix, setMix] = useState(0)
  const [showWASD, setShowWASD] = useState(true)
  

  const cavePos = [6, 0, -6]
  const pondPos = [-6, 0, -4]
  const npcPos = [6, 0, -3.8]

  const nearNPC =
    Math.hypot(pos[0] - npcPos[0], pos[2] - npcPos[2]) < 2.2
  const nearPond =
    Math.hypot(pos[0] - pondPos[0], pos[2] - pondPos[2]) < 2.8

  /* 🚫 INSTANTLY HIDE WASD WHEN NEAR NPC OR POND */
  useEffect(() => {
    if (nearNPC || nearPond) {
      setShowWASD(false)
    }
  }, [nearNPC, nearPond])

  useEffect(() => {
    const t = setTimeout(() => setShowWASD(false), 5000)
    return () => clearTimeout(t)
  }, [])

  const trees = useRef([])
  if (trees.current.length === 0) {
    while (trees.current.length < 200) {
      const x = Math.random() * 100 - 50
      const z = Math.random() * 100 - 50

      // 🚫 Avoid cave
      if (Math.hypot(x - cavePos[0], z - cavePos[2]) < 6) continue

      // 🚫 Avoid pond
      if (Math.hypot(x - pondPos[0], z - pondPos[2]) < 5) continue

      // 🚫 Avoid NPC
      if (Math.hypot(x - npcPos[0], z - npcPos[2]) < 4) continue

      // 🚫 Avoid present (near NPC, slightly offset)
      const presentPos = [npcPos[0] + 1.2, npcPos[2] + 0.5]
      if (Math.hypot(x - presentPos[0], z - presentPos[1]) < 3) continue

      // 🚫 Avoid slide (in front of pond)
      const slidePos = [pondPos[0], pondPos[2] - 4]
      if (Math.hypot(x - slidePos[0], z - slidePos[1]) < 7) continue

      trees.current.push({
        pos: [x, 0, z],
        scale: 0.7 + Math.random() * 0.7
      })
    }

  }

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'n') setNight(v => !v)

      setPos(([x, y, z]) => {
        if (e.key === 'w') { setRotY(Math.PI / 2); return [x, y, z - 0.4] }
        if (e.key === 's') { setRotY(-Math.PI / 2); return [x, y, z + 0.4] }
        if (e.key === 'a') { setRotY(Math.PI); return [x - 0.4, y, z] }
        if (e.key === 'd') { setRotY(0); return [x + 0.4, y, z] }
        return [x, y, z]
      })

      if (e.key === 'e' && nearNPC) {
        window.open('https://drive.google.com/YOUR_PHOTOS_LINK', '_blank')
      }
      if (e.key === 'e' && nearPond) {
        window.open('https://YOUR_LETTER_LINK', '_blank')
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [nearNPC, nearPond])

  return (
    <>
      <Canvas frameloop="always" camera={{ position: [0, 4, 8], fov: 60 }}>

        <color
          attach="background"
          args={[new Color('#9fd3ff').lerp(new Color('#0b1026'), mix)]}
        />
        <NightFog mix={mix} />



        <Suspense fallback={<mesh />}>
          <SceneController night={night} setMix={setMix} />

          <ambientLight intensity={0.8 - mix * 0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1 - mix * 0.6} />

          <pointLight
            position={[cavePos[0], 2.5, cavePos[2] + 1.5]}
            intensity={0.6 + mix}
            color="#ffd6a0"
            distance={7}
          />

          <SunMoon mix={mix} />
          <Birds />
          <CameraFollow pos={pos} />

          <mesh rotation-x={-Math.PI / 2} position={[0, 0, -30]}>
            <planeGeometry args={[120, 120]} />
            <meshStandardMaterial color="#3b5f3b" />
          </mesh>


          <Axolotl pos={pos} rotY={rotY} />
          <Cave position={cavePos} playerPos={pos} />
          <NPCAxolotl pos={npcPos} playerPos={pos} />
          <Present npcPos={npcPos} />


          <mesh position={[pondPos[0], 0.02, pondPos[2]]} rotation-x={-Math.PI / 2}>
            <circleGeometry args={[3.5, 32]} />
            <meshStandardMaterial color="#4fa3d1" transparent opacity={0.85} />
          </mesh>

          <mesh position={[pondPos[0], 0.04, pondPos[2]]} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[3.7, 4.3, 32]} />
            <meshStandardMaterial color="#4a7c4a" />
          </mesh>

          <Slide pondPos={pondPos} />


          {trees.current.map((t, i) => (
            <Tree key={i} position={t.pos} scale={t.scale} />
          ))}

          {mix > 0.35 && <Fireflies center={cavePos} intensity={mix * 1.2} />}
        </Suspense>
      </Canvas>
      <AmbientSound night={night} />

      {night && mix > 0.35 && (
        <div className="ui top">
          Waoooo fireflies near cave ✨🪰
        </div>
      )}


      {showWASD && (
        <div className="ui">
          Use <b>W A S D</b> to move 🌱 <br />
          Press <b>N</b> for day / night
        </div>
      )}

      {!showWASD && nearNPC && (
        <div className="ui">
          Waooo! Its a Wuzulotl Happy buddayyy 🙀🙀 <br />
          It is me Tuzulotl 🥰 and this is my smol cave 🪨<br />
          Did you go to the pond 🌊? Try going inside it 🙀 <br />
          Alsooooo i hab something for u 💖<br />
          <b>Press E</b> to open
        </div>
      )}

      {!showWASD && nearPond && (
        <div className="ui">
          The pond is hiding a surprise ✨ <br />
          <b>Press E</b> to read
        </div>
      )}
    </>
  )
}
