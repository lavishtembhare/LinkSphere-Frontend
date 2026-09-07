import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const ThreeCanvas = ({ className = 'absolute inset-0 pointer-events-none' }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 22

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // 1. Particle Cloud (Global Edge Nodes)
    const particleCount = 180
    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const originalPositions = new Float32Array(particleCount * 3)

    const sphereRadius = 8.5
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount)
      const theta = Math.sqrt(particleCount * Math.PI) * phi

      const x = sphereRadius * Math.cos(theta) * Math.sin(phi)
      const y = sphereRadius * Math.sin(theta) * Math.sin(phi)
      const z = sphereRadius * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      originalPositions[i * 3] = x
      originalPositions[i * 3 + 1] = y
      originalPositions[i * 3 + 2] = z
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    )

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.28,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    })

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particleSystem)

    // 2. Dynamic Constellation Mesh Lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    })

    const lineGeometry = new THREE.BufferGeometry()
    const linePositions = []

    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = positions[i * 3] - positions[j * 3]
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < 3.2) {
          linePositions.push(
            positions[i * 3],
            positions[i * 3 + 1],
            positions[i * 3 + 2],
            positions[j * 3],
            positions[j * 3 + 1],
            positions[j * 3 + 2]
          )
        }
      }
    }

    lineGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    )
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lineMesh)

    // 3. Glowing Outer Orbit Rings
    const ringGroup = new THREE.Group()

    const createOrbitRing = (radius, tiltX, tiltY, color = 0x38bdf8) => {
      const ringGeo = new THREE.RingGeometry(radius, radius + 0.05, 64)
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = tiltX
      ring.rotation.y = tiltY
      return ring
    }

    const ring1 = createOrbitRing(10.5, Math.PI / 3, Math.PI / 6, 0x38bdf8)
    const ring2 = createOrbitRing(12.0, -Math.PI / 4, Math.PI / 4, 0x3b82f6)
    ringGroup.add(ring1)
    ringGroup.add(ring2)
    scene.add(ringGroup)

    // Mouse Interaction Tracking
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const onMouseMove = (event) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    window.addEventListener('mousemove', onMouseMove)

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }

    const resizeObserver = new ResizeObserver(() => handleResize())
    resizeObserver.observe(container)

    // Animation Render Loop
    let animationId
    let clock = new THREE.Clock()

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Smooth mouse interpolation
      targetX += (mouseX * 0.8 - targetX) * 0.05
      targetY += (mouseY * 0.8 - targetY) * 0.05

      particleSystem.rotation.y = elapsedTime * 0.08 + targetX * 0.4
      particleSystem.rotation.x = elapsedTime * 0.04 + targetY * 0.4

      lineMesh.rotation.y = particleSystem.rotation.y
      lineMesh.rotation.x = particleSystem.rotation.x

      ring1.rotation.z = elapsedTime * 0.12
      ring2.rotation.z = -elapsedTime * 0.09
      ringGroup.rotation.y = targetX * 0.2
      ringGroup.rotation.x = targetY * 0.2

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', onMouseMove)
      resizeObserver.disconnect()
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
      particleGeometry.dispose()
      particleMaterial.dispose()
      lineGeometry.dispose()
      lineMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className={className} />
}

export default ThreeCanvas