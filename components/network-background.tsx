"use client"

import { useRef, useEffect, useState } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface NetworkNode {
  position: THREE.Vector3
  velocity: THREE.Vector3
  originalPosition: THREE.Vector3
  activation: number
  pulseTarget: number
}

function BrainNetworkGraph() {
  const { scene, camera, size } = useThree()
  const pointsRef = useRef<THREE.Points | null>(null)
  const linesRef = useRef<THREE.LineSegments | null>(null)
  const nodesRef = useRef<NetworkNode[]>([])

  useEffect(() => {
    // Clear previous geometry
    scene.clear()

    // Create circular texture for nodes - sharp and clear
    const canvas = document.createElement("canvas")
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, 128, 128)
      // Sharp glow effect for neural nodes
      const gradient = ctx.createRadialGradient(64, 64, 8, 64, 64, 64)
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)")
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.7)")
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 128, 128)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter

    // Create brain-shaped neural network
    const nodeCount = 80
    const nodes: NetworkNode[] = []
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(nodeCount * 3)
    const colors = new Float32Array(nodeCount * 3)

    // Create two brain hemispheres with neural structure
    for (let i = 0; i < nodeCount; i++) {
      let x, y, z
      
      // Create two hemisphere clusters
      const hemisphere = i < nodeCount / 2 ? -1 : 1
      
      // Use spherical distribution to create brain-like shape
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = 2.5 + Math.random() * 1.5
      
      x = (Math.sin(phi) * Math.cos(theta) * radius + hemisphere * 1.5)
      y = Math.cos(phi) * radius + (Math.random() - 0.5) * 0.8
      z = Math.sin(phi) * Math.sin(theta) * radius * 0.6

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // White/silver neural nodes
      colors[i * 3] = 0.85
      colors[i * 3 + 1] = 0.87
      colors[i * 3 + 2] = 0.9

      nodes.push({
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.012
        ),
        originalPosition: new THREE.Vector3(x, y, z),
        activation: 0,
        pulseTarget: 0,
      })
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      sizeAttenuation: true,
      map: texture,
      transparent: true,
      opacity: 1,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)
    pointsRef.current = points
    nodesRef.current = nodes

    // Create synapse-like connections
    const lineGeometry = new THREE.BufferGeometry()
    const linePositions: number[] = []
    const lineColors: number[] = []

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const distance = nodes[i].position.distanceTo(nodes[j].position)
        // Connect nearby neurons - synaptic connections
        if (distance < 3 && distance > 0.5) {
          linePositions.push(
            nodes[i].position.x,
            nodes[i].position.y,
            nodes[i].position.z,
            nodes[j].position.x,
            nodes[j].position.y,
            nodes[j].position.z
          )

          // Subtle white/blue synaptic lines
          lineColors.push(0.5, 0.6, 0.75, 0.5, 0.6, 0.75)
        }
      }
    }

    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(linePositions), 3)
    )
    lineGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(lineColors), 3)
    )

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
      linewidth: 0.5,
    })

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)
    linesRef.current = lines

    return () => {
      geometry.dispose()
      lineGeometry.dispose()
      material.dispose()
      lineMaterial.dispose()
      texture.dispose()
    }
  }, [scene])

  useFrame(() => {
    if (pointsRef.current && nodesRef.current) {
      const positionAttribute = pointsRef.current.geometry.getAttribute(
        "position"
      ) as THREE.BufferAttribute
      const colorAttribute = pointsRef.current.geometry.getAttribute(
        "color"
      ) as THREE.BufferAttribute
      const positions = positionAttribute.array as Float32Array
      const colors = colorAttribute.array as Float32Array

      // Random neural firing (synaptic activation)
      if (Math.random() < 0.08) {
        const randomIndex = Math.floor(Math.random() * nodesRef.current.length)
        nodesRef.current[randomIndex].pulseTarget = 1
        nodesRef.current[randomIndex].activation = 0
      }

      // Update neural nodes
      for (let i = 0; i < nodesRef.current.length; i++) {
        const node = nodesRef.current[i]

        // Subtle organic drift
        node.position.add(node.velocity)

        // Keep nodes within brain-like bounds
        if (Math.abs(node.position.x) > 5) {
          node.velocity.x *= -0.5
          node.position.x = Math.sign(node.position.x) * 5
        }
        if (Math.abs(node.position.y) > 5) {
          node.velocity.y *= -0.5
          node.position.y = Math.sign(node.position.y) * 5
        }
        if (Math.abs(node.position.z) > 3) {
          node.velocity.z *= -0.5
          node.position.z = Math.sign(node.position.z) * 3
        }

        positions[i * 3] = node.position.x
        positions[i * 3 + 1] = node.position.y
        positions[i * 3 + 2] = node.position.z

        // Neural firing effect
        if (node.pulseTarget > 0) {
          node.activation += 0.08
          const pulseIntensity = Math.sin(node.activation * Math.PI) * 0.5

          // Glow during activation
          colors[i * 3] = 0.85 + pulseIntensity * 0.3
          colors[i * 3 + 1] = 0.87 + pulseIntensity * 0.2
          colors[i * 3 + 2] = 0.9 + pulseIntensity * 0.4

          if (node.activation >= 1) {
            node.pulseTarget = 0
            node.activation = 0
          }
        } else {
          // Return to baseline white/silver
          colors[i * 3] = 0.85
          colors[i * 3 + 1] = 0.87
          colors[i * 3 + 2] = 0.9
        }
      }

      positionAttribute.needsUpdate = true
      colorAttribute.needsUpdate = true
    }
  })

  return null
}

interface NetworkBackgroundProps {
  isHovered?: boolean
}

export function NetworkBackground({ isHovered }: NetworkBackgroundProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 75 }}
        gl={{
          alpha: true,
          antialias: true,
          precision: "highp",
          powerPreference: "high-performance",
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <BrainNetworkGraph />
      </Canvas>
      {/* Elegant dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/55 z-10" />
    </div>
  )
}
