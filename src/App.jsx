import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
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
useGLTF.preload('/capy.glb')
useGLTF.preload('/wheel.glb')
useGLTF.preload('/chick.glb')
useGLTF.preload('/tree_house.glb')
useGLTF.preload('/scooty.glb')
useGLTF.preload('/hector.glb')
useGLTF.preload('/waft.glb')
useGLTF.preload('/wsign.glb')
useGLTF.preload('/cat.glb')
useGLTF.preload('/deer.glb')

function Cat({ npcPos, playerPos, npcFollow, npcLivePos }) {
  const { scene } = useGLTF('/cat.glb')
  const model = useMemo(() => scene.clone(true), [scene])
  const group = useRef()

  // cat movement
  const livePos = useRef([npcPos[0] + 1.2, 0, npcPos[2] + 1])

  useFrame(() => {
    if (!group.current) return

    if (npcFollow) {

      // 📍 FOLLOW TARGET: behind NPC  
      const offsetDistance = -1.2  // how far behind
      const angle = Math.atan2(
        playerPos[0] - npcLivePos.current[0],
        playerPos[2] - npcLivePos.current[2]
      )

      const targetX = npcLivePos.current[0] + Math.sin(angle) * offsetDistance
      const targetZ = npcLivePos.current[2] + Math.cos(angle) * offsetDistance

      const dx = targetX - livePos.current[0]
      const dz = targetZ - livePos.current[2]
      const dist = Math.hypot(dx, dz)
      const speed = 0.045

      if (dist > 0.5) {
        livePos.current[0] += (dx / dist) * speed
        livePos.current[2] += (dz / dist) * speed
      }

      group.current.rotation.y = Math.atan2(dx, dz)
    }

    group.current.position.set(
      livePos.current[0],
      0,
      livePos.current[2]
    )
  })

  return (
    <group ref={group}>
      <primitive object={model} scale={0.025} />
    </group>
  )
}



function Deer({ position }) {
  const group = useRef()
  const { scene, animations } = useGLTF('/deer.glb')
  const { actions } = useAnimations(animations, group)

  // play animations
  useEffect(() => {
    if (!actions) return
    Object.values(actions).forEach(action => {
      action.reset().play()
    })
  }, [actions])

  return (
    <group ref={group} position={position} scale={1.4} rotation = {[0,Math.PI/2,0]}>
      <primitive object={scene} />
    </group>
  )
}



function Waft({WheelPos}){
  const {scene} = useGLTF('/waft.glb')
  const model = useMemo(() => scene.clone(true), [scene])

  return (
    <primitive
      object = {model}
      position = {[WheelPos[0] + 35, 0.25, WheelPos[2] - 15]}
      rotation = {[0, Math.PI/2, 0]}
      scale = {0.007}
    />
  )
}

function Wsign({WheelPos}){
  const {scene} = useGLTF('/wsign.glb')
  const model = useMemo(() => scene.clone(true), [scene])

  return (
    <primitive
      object = {model}
      position = {[WheelPos[0] + 30, 0.25, WheelPos[2] - 5]}
      rotation = {[0, Math.PI, 0]}
      scale = {0.05}
    />
  )
}


function Scooty({WheelPos}){
  const {scene} = useGLTF('/scooty.glb')
  const model = useMemo(() => scene.clone(true), [scene])

  return (
    <primitive
      object = {model}
      position = {[WheelPos[0] + 5, -0.05, WheelPos[2] + 3]}
      rotation = {[0, -Math.PI/2, 0]}
      scale = {0.8}
    />
  )
}


function Hector({cavePos}){
  const {scene} = useGLTF('/hector.glb')
  const model = useMemo(() => scene.clone(true), [scene])

  return (
    <primitive
      object = {model}
      position = {[cavePos[0] -3, 0.3, cavePos[2] - 10]}
      rotation = {[0, -Math.PI/2, 0]}
      scale = {0.25}
    />
  )
}

function TreeHouse({ pondPos }) {
  const { scene } = useGLTF('/tree_house.glb')
  const model = useMemo(() => scene.clone(true), [scene])

  return (
    <primitive
      object={model}
      position={[
        pondPos[0] + 5.5, // 👉 RIGHT of cave
        -0.95,
        pondPos[2] - 20  // 👉 slight forward so it’s visible
      ]}
      rotation={[0, 0, 0]}
      scale={0.125}
    />
  )
}


function Wheel({ pondPos }) {
  const group = useRef()
  const { scene, animations } = useGLTF('/wheel.glb')
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    if (!actions) return

    // play ALL animations (some models have multiple clips)
    Object.values(actions).forEach(action => {
      action.reset().play()
    })
  }, [actions])

  return (
    <group
      ref={group}
      position={[
        pondPos[0] - 15, // 👈 LEFT of pond (adjust if needed)
        3,
        pondPos[2] - 20
      ]}
      rotation={[0, Math.PI / 2, 0]}
      scale={1.5}

    >
      <primitive object={scene} />
    </group>
  )
}





function Present({ position }) {
  const { scene } = useGLTF('/present.glb')
  const model = useMemo(() => scene.clone(true), [scene])

  return (
    <primitive
      object={model}
      position={position}
      scale={0.02}
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

function Chick({ pondPos }) {
  const { scene } = useGLTF('/chick.glb')
  const model = useMemo(() => scene.clone(true), [scene])
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return

    // 🐥 idle bob ONLY
    ref.current.position.y =
      0.15 + Math.sin(clock.getElapsedTime() * 3) * 0.05
  })

  return (
    <primitive
      ref={ref}
      object={model}
      position={[
        pondPos[0], // 👈 left of pond (adjust if needed)
        0.15,
        pondPos[2] - 1
      ]}
      rotation={[0, -Math.PI / 2, 0]}
      scale={0.4}
    />
  )
}




function Capy({ pondPos }) {
  const { scene } = useGLTF('/capy.glb')
  const model = useMemo(() => scene.clone(true), [scene])

  return (
    <primitive
      object={model}
      position={[
        pondPos[0] + 5.5,  // 👉 right of slide
        0,
        pondPos[2] - 9     // 👉 same Z as slide
      ]}
      rotation={[0, Math.PI / 2, 0]}
      scale={1.5}
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

function NPCAxolotl({ npcPos, playerPos, follow, setNpcPos }) {
  const { scene } = useGLTF('/axolotl.glb')
  const model = useMemo(() => scene.clone(true), [scene])
  const group = useRef()

  // store live position
  const livePos = useRef([...npcPos])

  useFrame(() => {
    if (!group.current) return

    if (follow) {
      const speed = 0.05
      const dx = playerPos[0] - livePos.current[0]
      const dz = playerPos[2] - livePos.current[2]
      const dist = Math.hypot(dx, dz)

      if (dist > 1.2) {
        livePos.current[0] += (dx / dist) * speed
        livePos.current[2] += (dz / dist) * speed

        // update react state occasionally
        if (Math.random() < 0.05) {
          setNpcPos([...livePos.current])
        }
      }

      group.current.rotation.y = Math.atan2(dx, dz)
    }

    // sync visual position every frame
    group.current.position.set(
      livePos.current[0],
      1.1,
      livePos.current[2]
    )
  })

  // sync start position
  useEffect(() => {
    livePos.current = [...npcPos]
  }, [])

  return (
    <group ref={group}>
      <primitive object={model} scale={0.5} rotation = {[0,-Math.PI/2,0]}/>
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

function Mountains() {
  const mountains = useRef([])

  if (mountains.current.length === 0) {
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = 70 + Math.random() * 30

      mountains.current.push({
        x: Math.cos(angle) * distance,
        z: Math.sin(angle) * distance,
        height: 8 + Math.random() * 12,
        radius: 6 + Math.random() * 6
      })
    }
  }

  return mountains.current.map((m, i) => (
    <mesh key={i} position={[m.x, m.height / 2 - 2, m.z]}>
      <coneGeometry args={[m.radius, m.height, 6]} />
      <meshStandardMaterial
        color="#2e3f2e"
        roughness={1}
        flatShading
      />
    </mesh>
  ))
}




export default function App() {
  const [pos, setPos] = useState([0, 0, -5])
  const [rotY, setRotY] = useState(-Math.PI/2)
  const [night, setNight] = useState(false)
  const [mix, setMix] = useState(0)
  const [showWASD, setShowWASD] = useState(true)
  const [controlsHidden, setControlsHidden] = useState(false)
  const [giftOpened, setGiftOpened] = useState(false)
  const [npcPos, setNpcPos] = useState([6, 0, -3.8])
  const [npcFollow, setNpcFollow] = useState(false)
  const npcPosRef = useRef(npcPos)
  useEffect(() => { npcPosRef.current = npcPos }, [npcPos])




  

  const cavePos = [6, 0, -6]
  const pondPos = [-6, 0, -4]
  const capyPos = [pondPos[0] + 5.5,0, pondPos[2] - 9]
  const WheelPos = [pondPos[0] - 9, 0, pondPos[2] - 14]
  const PlayerPos = [0, 0, -5]
  const Thpos = [pondPos[0] + 5.5, -0.95, pondPos[2] - 20]
  const ScPos = [cavePos[0] + 3, 0, cavePos[2] - 10]
  const WftPos = [WheelPos[0] + 35, 0.25, WheelPos[2] - 15]
  const HecPos = [cavePos[0] -3, 0.3, cavePos[2] - 10]
  const deerPos = [-10, 0, -5]
  const presentPos = useMemo(() => [
    6 + 1.2,
    0.4,
    -3.8 + 0.5
  ], [])

  



  const nearNPC =
    Math.hypot(pos[0] - npcPos[0], pos[2] - npcPos[2]) < 2.2
  const nearPond =
    Math.hypot(pos[0] - pondPos[0], pos[2] - pondPos[2]) < 2.8
  const nearCapy =
  Math.hypot(pos[0] - capyPos[0], pos[2] - capyPos[2]) < 2.5


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

  useEffect(() => {
  if (!giftOpened) return
  
  const meow = new Audio('/meow.mp3')
  meow.volume = 0.4
  meow.play().catch(() => {})
  } , [giftOpened])


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

      if(Math.hypot(x - capyPos[0], z - capyPos[2]) < 5) continue;
      if(Math.hypot(x - WheelPos[0] + 6, z - WheelPos[2] + 6) < 15) continue;
      if(Math.hypot(x - PlayerPos[0], z - PlayerPos[2]) < 10) continue;
      if(Math.hypot(x - Thpos[0], z - Thpos[2]) < 5) continue;
      if(Math.hypot(x - ScPos[0], z - ScPos[2]) < 5) continue;
      if(Math.hypot(x - WftPos[0], z - WftPos[2]) < 20) continue;
      if(Math.hypot(x - HecPos[0], z - HecPos[2]) < 7) continue;


      trees.current.push({
        pos: [x, 0, z],
        scale: 0.7 + Math.random() * 0.7
      })
    }

  }

  useEffect(() => {
  const onKey = e => {
      if (e.key === 'n') setNight(v => !v)

      // ✅ THIS WAS MISSING
      if (e.key === 'h') {
        setControlsHidden(v => !v)
      }

      if (e.key === 'f' && nearNPC) {
          setNpcFollow(v => !v)
        }


      setPos(([x, y, z]) => {
        if (e.key === 'w') { setRotY(Math.PI / 2); return [x, y, z - 0.4] }
        if (e.key === 's') { setRotY(-Math.PI / 2); return [x, y, z + 0.4] }
        if (e.key === 'a') { setRotY(Math.PI); return [x - 0.4, y, z] }
        if (e.key === 'd') { setRotY(0); return [x + 0.4, y, z] }
        return [x, y, z]
      })

      if (e.key === 'e' && nearNPC && !giftOpened) {
        setGiftOpened(true)
      }

      if (e.key === 'e' && nearPond) {
        window.open(
          'https://docs.google.com/document/d/1SLfZ5iF28h7gaE0UykZdE98lWJnP8Q5iiQJyTV3XZBQ/edit?usp=sharing',
          '_blank'
        )
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
          <TreeHouse pondPos={pondPos} />
          <Hector cavePos= {cavePos}/>
          <NPCAxolotl
            npcPos={npcPos}
            playerPos={pos}
            follow={npcFollow}
            setNpcPos={setNpcPos}
          />
          {!giftOpened && <Present position={presentPos} />}
          {giftOpened && (
          <Cat
            npcPos={npcPos}
            playerPos={pos}
            npcFollow={npcFollow}
            npcLivePos={npcPosRef}   // 👈 add below
          />
        )}



          <Deer position={deerPos} />

          <Mountains />
          
          <Wsign WheelPos={WheelPos}/>



          <mesh position={[pondPos[0], 0.02, pondPos[2]]} rotation-x={-Math.PI / 2}>
            <circleGeometry args={[3.5, 32]} />
            <meshStandardMaterial color="#4fa3d1" transparent opacity={0.85} />
          </mesh>

          <mesh position={[pondPos[0], 0.04, pondPos[2]]} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[3.7, 4.3, 32]} />
            <meshStandardMaterial color="#4a7c4a" />
          </mesh>

          <Slide pondPos={pondPos} />
          <Capy pondPos={pondPos} playerPos={pos} nearCapy={nearCapy} />
          <Chick pondPos={pondPos} playerPos={pos} />
          <Wheel pondPos={pondPos} />
          <Scooty WheelPos={WheelPos}/>
          <Waft WheelPos={WheelPos}/>



          {trees.current.map((t, i) => (
            <Tree key={i} position={t.pos} scale={t.scale} />
          ))}

          {mix > 0.35 && <Fireflies center={cavePos} intensity={mix * 1.2} />}
          {mix > 0.35 && (
            <Fireflies
              center={[
                pondPos[0] + 5.5,
                0.8,                 // slightly ABOVE the tree house
                pondPos[2] - 20
              ]}
              intensity={mix * 1.2}
            />
          )}

        </Suspense>
      </Canvas>
      <div className="controls-ui">
      {!controlsHidden ? (
        <>
          W A S D → Move 🌱<br />
          N → Day / Night 🌙☀️<br />
          Press <b>H</b> to hide controls
        </>
      ) : (
        <>
          Press <b>H</b> to show controls
        </>
      )}
    </div>

      <AmbientSound night={night} />

      {night && mix > 0.35 && (
        <div className="ui top">
          Waoooo fireflies near cave ✨🪰
        </div>
      )}

      {!showWASD && nearCapy && (
        <div className="ui">
          thats you and me btw 💖 <br />
          you the smoler one on top with da 👑 <br />
          cus you my princess ✨ <br/>
          wuzu tuzu scooty is parked ahead 🙀
        </div>
      )}

      {!showWASD && nearNPC && (
  <div className="ui">
    {!npcFollow ? (
      <>
        Waooo! Its a Wuzulotl Happy buddayyy 🙀🙀 <br />
        It is me Tuzulotl 🥰 and this is my smol cave 🪨<br />
        Did you go to the pond🌊? Chinki is also there, try going inside water 🙀 <br />
        Alsooooo i hab something for u 💖<br />
        <b>Press E</b> to open<br/><br/>
        <b>Press F</b> to make me follow 🐾
      </>
    ) : (
      <>
        Wuzuu I'm following you 🐾✨ <br/>
        <b>Press F</b> to stop following
      </>
    )}
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
