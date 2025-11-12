"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default function SplineLogo() {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (typeof window !== "undefined") {
            const container = canvasContainerRef.current;
            if (!container) return;

            const scene = new THREE.Scene();
            // Transparent background
            
            // Use perspective camera
            const camera = new THREE.PerspectiveCamera(
                50,
                60/90, // Square aspect ratio for 90x90
                0.1,
                2000
            );
            camera.setFocalLength(200);
            
            // Enable antialiasing and transparency
            const renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
            });
            renderer.setSize(60, 90);
            renderer.setPixelRatio(window.devicePixelRatio);
            
            // Professional rendering settings
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.5;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            container.appendChild(renderer.domElement);
            
            // Camera position for logo view
            camera.position.z = 18;
            camera.position.y = 1.35;
            // camera.position.x = -0.25;

            // Animation setup
            let mixer: THREE.AnimationMixer | null = null;
            const clock = new THREE.Clock();
            const animationMap = new Map<string, THREE.AnimationAction>();

            // Load GLB model
            const loader = new GLTFLoader();
            const modelPath = "/models/MB.glb";
            loader.load(
                modelPath,
                (gltf) => {
                    // Adjust model position/scale
                    gltf.scene.position.set(0, 0, 0);
                    gltf.scene.scale.set(1.8, 1.8, 1.8);
                    
                    // Calculate bounding box to find the center
                    const box = new THREE.Box3().setFromObject(gltf.scene);
                    const size = box.getSize(new THREE.Vector3()).length();
                    const center = box.getCenter(new THREE.Vector3());
                    
                    // Create a pivot group at the visual center
                    const pivotGroup = new THREE.Group();
                    pivotGroup.position.copy(center);
                    
                    // Offset the model within the pivot group
                    gltf.scene.position.set(-center.x, -center.y, -center.z);
                    
                    // Parent model to pivot group
                    pivotGroup.add(gltf.scene);
                    
                    // Add pivot group to scene
                    scene.add(pivotGroup);

                    // Calculate light positions based on model size
                    const lightCenter = center.clone();
                    const dist = size * 1.5;
                    const height = size * 0.6;
                    const side = size * 1.2;

                    // Colors with temperature
                    const keyColor = 0xffe2c6;  // Warm ~3200K
                    const fillColor = 0xcfe6ff; // Cool ~6000K
                    const rimColor = 0xffffff;

                    // A) Key light - SpotLight
                    const keyLight = new THREE.SpotLight(keyColor, 0.1, dist * 3, Math.PI / 6, 0.3, 1.5);
                    keyLight.position.set(lightCenter.x + side, lightCenter.y + height, lightCenter.z + dist);
                    keyLight.target.position.copy(lightCenter);
                    keyLight.castShadow = true;
                    keyLight.shadow.mapSize.set(2048, 2048);
                    keyLight.shadow.bias = -0.0002;
                    keyLight.shadow.normalBias = 0.02;
                    scene.add(keyLight, keyLight.target);

                    // B) Fill light - DirectionalLight
                    const fillLight = new THREE.DirectionalLight(fillColor, 2.0);
                    fillLight.position.set(lightCenter.x - side * 1.2, lightCenter.y + height * 0.3, lightCenter.z + dist * 0.8);
                    fillLight.target.position.copy(lightCenter);
                    scene.add(fillLight, fillLight.target);

                    // C) Rim light - DirectionalLight
                    const rimLight = new THREE.DirectionalLight(rimColor, 0.2);
                    rimLight.position.set(lightCenter.x, lightCenter.y + height * 1.2, lightCenter.z - dist);
                    rimLight.target.position.copy(lightCenter);
                    scene.add(rimLight, rimLight.target);

                    // D) Hemisphere light for ambient "air"
                    const hemiLight = new THREE.HemisphereLight(0xeaf2ff, 0x1b1b1b, 0.7);
                    scene.add(hemiLight);

                    // Setup animations
                    if (gltf.animations && gltf.animations.length > 0) {
                        mixer = new THREE.AnimationMixer(gltf.scene);

                        // Create actions for all animations
                        gltf.animations.forEach((clip) => {
                            const action = mixer!.clipAction(clip);
                            action.setLoop(THREE.LoopOnce, 1);
                            action.clampWhenFinished = true;
                            action.time = 0;
                            action.play(); // Must call play() first to activate the action
                            action.paused = true; // Then pause it at the start
                            animationMap.set(clip.name, action);
                        });
                    }
                },
                undefined,
                (error) => {
                    console.error("Error loading model:", error);
                }
            );

            // Hover state tracking
            let isHovering = false;

            // Hover handlers
            const onMouseEnter = () => {
                if (!isHovering) {
                    isHovering = true;
                    container.style.cursor = 'pointer';
                    
                    // Play all animations forward
                    animationMap.forEach((action) => {
                        action.timeScale = 1.5; // Play forward at 2x speed
                        action.paused = false;
                        action.play();
                    });
                }
            };

            const onMouseLeave = () => {
                if (isHovering) {
                    isHovering = false;
                    container.style.cursor = 'default';
                    
                    // Play all animations backward
                    animationMap.forEach((action) => {
                        action.timeScale = -1.5; // Play backward at 2x speed
                        action.paused = false;
                        action.play();
                    });
                }
            };

            container.addEventListener('mouseenter', onMouseEnter);
            container.addEventListener('mouseleave', onMouseLeave);

            // Animation loop
            const animate = () => {
                requestAnimationFrame(animate);

                // Update animations
                const delta = clock.getDelta();
                if (mixer) {
                    mixer.update(delta);
                }

                renderer.render(scene, camera);
            };
            animate();

            // Cleanup
            return () => {
                container.removeEventListener('mouseenter', onMouseEnter);
                container.removeEventListener('mouseleave', onMouseLeave);
                
                renderer.dispose();
                if (container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
            };
        }
    }, []);
    
    return (
        <Link href='/'>
            <div 
                ref={canvasContainerRef} 
                className='canvas-container'
                style={{ width: "90px", height: "90px" }}
            />
        </Link>
    );
}
