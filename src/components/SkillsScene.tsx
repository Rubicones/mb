"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default function SkillsScene({ hoverContainerRef }: { hoverContainerRef: React.RefObject<HTMLDivElement | null> }) {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (typeof window !== "undefined") {
            const container = canvasContainerRef.current;
            const hoverTarget = hoverContainerRef.current;
            if (!container || !hoverTarget) return;
            
            const scene = new THREE.Scene();
            // Transparent background - don't set scene.background
            const camera = new THREE.PerspectiveCamera(
                75,
                300 / 330,
                0.1,
                1000
            );
            // Enable antialiasing for smoother edges and transparent background
            const renderer = new THREE.WebGLRenderer({ 
                antialias: true,
                alpha: true 
            });
            renderer.setClearColor(0x000000, 0); // Transparent background
            renderer.setSize(300, 330);
            renderer.setPixelRatio(window.devicePixelRatio); // High-DPI display support
            
            container.appendChild(renderer.domElement);
            camera.position.z = 3;
            camera.position.y = 0.5;
            
            // Animation mixer for playing model animations
            let mixer: THREE.AnimationMixer | null = null;
            const clock = new THREE.Clock();
            const actions: THREE.AnimationAction[] = [];
            
            // Load GLB model
            const loader = new GLTFLoader();
            loader.load(
                '/models/tools3.glb', // or '/models/skill1.glb'
                (gltf) => {
                    // Model loaded successfully
                    scene.add(gltf.scene);
                    
                    // Setup animations if they exist
                    if (gltf.animations && gltf.animations.length > 0) {
                        mixer = new THREE.AnimationMixer(gltf.scene);
                        
                        // Setup all animations but don't play yet
                        gltf.animations.forEach((clip) => {
                            const action = mixer!.clipAction(clip);
                            action.setLoop(THREE.LoopOnce, 1); // Play once, don't loop
                            action.clampWhenFinished = true; // Stay at final frame
                            action.timeScale = 1; // Normal speed
                            action.paused = true; // Start paused
                            action.time = 0; // Start at beginning
                            action.play();
                            actions.push(action);
                        });
                        
                        console.log(`Loaded ${gltf.animations.length} animation(s)`);
                    }
                    
                    // Optional: adjust model position/scale
                    gltf.scene.position.set(0, 0, 0);
                    gltf.scene.scale.set(1, 1, 1);
                    // gltf.scene.rotation.x = Math.PI / 2;
                },
                undefined,
                (error) => {
                    console.error('Error loading model:', error);
                }
            );
            
            // Hover event handlers
            const handleMouseEnter = () => {
                console.log("mouse enter");
                actions.forEach((action) => {
                    action.timeScale = 1; // Play forward
                    action.paused = false;
                });
            };
            
            const handleMouseLeave = () => {
                console.log("mouse leave");
                actions.forEach((action) => {
                    action.timeScale = -1; // Play backward
                    action.paused = false;
                });
            };
            
            // Add event listeners to hover target
            hoverTarget.addEventListener('mouseenter', handleMouseEnter);
            hoverTarget.addEventListener('mouseleave', handleMouseLeave);

            // Add lights (important for seeing the model properly)
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);

            // Animation loop (needed to render continuously)
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
                hoverTarget.removeEventListener('mouseenter', handleMouseEnter);
                hoverTarget.removeEventListener('mouseleave', handleMouseLeave);
                renderer.dispose();
                container.removeChild(renderer.domElement);
            };
        }
    }, [hoverContainerRef]);
    return <div ref={canvasContainerRef} />;
};