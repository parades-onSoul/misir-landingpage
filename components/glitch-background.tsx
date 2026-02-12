"use client"

import { useRef, useEffect, useState } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { EffectComposer, GlitchPass, RenderPass } from "three-stdlib"
import * as THREE from "three"

interface GlitchSceneProps {
  isHovered: boolean
}

// Helper function to create a fallback texture
function createFallbackTexture(): THREE.Texture {
  const canvas = document.createElement("canvas")
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext("2d")
  
  if (ctx) {
    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, 256, 256)
    gradient.addColorStop(0, "#1a1a2e")
    gradient.addColorStop(1, "#16213e")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)
    
    // Add some texture
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`
      ctx.fillRect(
        Math.random() * 256,
        Math.random() * 256,
        Math.random() * 20,
        Math.random() * 20
      )
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearFilter
  return texture
}

// Helper function to load texture with fallback
async function loadTextureWithFallback(url: string): Promise<THREE.Texture> {
  const loader = new THREE.TextureLoader()
  
  return new Promise((resolve) => {
    loader.load(
      url,
      (texture) => {
        console.log(`Successfully loaded texture: ${url}`)
        resolve(texture)
      },
      undefined,
      (error) => {
        console.warn(`Failed to load texture ${url}, using fallback:`, error)
        resolve(createFallbackTexture())
      }
    )
  })
}

function GlitchScene({ isHovered }: GlitchSceneProps) {
  const { gl, scene, camera, size } = useThree()
  const composerRef = useRef<EffectComposer | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const glitchPassRef = useRef<GlitchPass | null>(null)
  const [defaultTexture, setDefaultTexture] = useState<THREE.Texture | null>(null)
  const [hoverTexture, setHoverTexture] = useState<THREE.Texture | null>(null)
  const glitchCountRef = useRef(0)
  const glitchTimeoutsRef = useRef<NodeJS.Timeout[]>([])
  
  // Load both textures with fallback on mount
  useEffect(() => {
    Promise.all([
      loadTextureWithFallback("/images/british-library-gUDNK8NqYHk-unsplash.jpg"),
      loadTextureWithFallback("/images/british-library-gUDNK8NqYHk-unsplash.jpg")
    ]).then(([defaultTex, hoverTex]) => {
      setDefaultTexture(defaultTex)
      setHoverTexture(hoverTex)
    })
  }, [])
  
  // Select texture based on hover state
  const texture = isHovered ? hoverTexture : defaultTexture

  useEffect(() => {
    // Wait for textures to load
    if (!defaultTexture || !hoverTexture || !texture) {
      return
    }

    // Calculate aspect ratios
    const imageAspect = texture.image.width / texture.image.height
    const screenAspect = size.width / size.height
    
    // Use orthographic camera
    const frustumSize = 1
    camera.left = -frustumSize * screenAspect
    camera.right = frustumSize * screenAspect
    camera.top = frustumSize
    camera.bottom = -frustumSize
    camera.near = 0.1
    camera.far = 1000
    ;(camera as THREE.OrthographicCamera).updateProjectionMatrix()
    
    // Calculate scale to cover screen while maintaining aspect ratio
    // This mimics CSS background-size: cover
    const scale = Math.max(
      (2 * frustumSize * screenAspect) / (imageAspect * 2 * frustumSize),
      1
    )
    
    const planeWidth = imageAspect * 2 * frustumSize * scale
    const planeHeight = 2 * frustumSize * scale
    
    // Create a plane geometry that covers the viewport
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
    const material = new THREE.MeshBasicMaterial({ 
      map: texture,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(geometry, material)
    meshRef.current = mesh
    
    // Position camera to see the plane
    camera.position.z = 1
    
    // Add mesh to scene
    scene.add(mesh)

    // Setup post-processing
    const composer = new EffectComposer(gl)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // Add glitch pass
    const glitchPass = new GlitchPass()
    glitchPass.goWild = false // Set to true for more intense glitch
    composer.addPass(glitchPass)
    glitchPassRef.current = glitchPass

    // Start with glitch disabled, then trigger it on a schedule
    glitchPass.enabled = true
    glitchCountRef.current = 0

    // Schedule glitch triggers: 7 total times with 10s intervals
    const triggerGlitch = (delay: number) => {
      const timeout = setTimeout(() => {
        if (glitchPassRef.current && !isHovered && glitchCountRef.current < 7) {
          glitchPassRef.current.enabled = true
          glitchCountRef.current += 1
          
          // Disable after a short duration
          const disableTimeout = setTimeout(() => {
            if (glitchPassRef.current && !isHovered) {
              glitchPassRef.current.enabled = false
            }
          }, 200)
          
          glitchTimeoutsRef.current.push(disableTimeout)
        }
      }, delay)
      
      glitchTimeoutsRef.current.push(timeout)
    }

    // Trigger glitch 6 more times after initial (at 10s, 20s, 30s, 40s, 50s, 60s)
    triggerGlitch(10000)
    triggerGlitch(20000)
    triggerGlitch(30000)
    triggerGlitch(40000)
    triggerGlitch(50000)
    triggerGlitch(60000)

    composerRef.current = composer

    return () => {
      if (meshRef.current) {
        scene.remove(meshRef.current)
        meshRef.current.geometry.dispose()
        ;(meshRef.current.material as THREE.Material).dispose()
      }
      // Clear all scheduled glitch timeouts
      glitchTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
      glitchTimeoutsRef.current = []
    }
  }, [gl, scene, camera, texture, defaultTexture, hoverTexture, size, isHovered])

  // Update texture when hover state changes
  useEffect(() => {
    if (meshRef.current && texture) {
      const material = meshRef.current.material as THREE.MeshBasicMaterial
      material.map = texture
      material.needsUpdate = true
    }
  }, [texture])

  // Disable glitch effect when hovering
  useEffect(() => {
    if (glitchPassRef.current) {
      if (isHovered) {
        // Disable glitch immediately when hovering
        glitchPassRef.current.enabled = false
      } else {
        // Just ensure it's disabled when not hovering (will be re-enabled by schedule)
        glitchPassRef.current.enabled = false
      }
    }
  }, [isHovered])

  // Update composer on resize
  useEffect(() => {
    if (composerRef.current) {
      composerRef.current.setSize(size.width, size.height)
    }
  }, [size])

  // Render using composer
  useEffect(() => {
    const animate = () => {
      if (composerRef.current) {
        composerRef.current.render()
      }
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  return null
}

interface GlitchBackgroundProps {
  isHovered: boolean
}

export function GlitchBackground({ isHovered }: GlitchBackgroundProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        gl={{ alpha: false, antialias: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <GlitchScene isHovered={isHovered} />
      </Canvas>
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-10" />
    </div>
  )
}
