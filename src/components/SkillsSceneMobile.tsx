"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

interface SkillsSceneProps {
    hoverContainerRef: React.RefObject<HTMLDivElement | null>;
    size: number;
}

export default function SkillsScene({ hoverContainerRef, size }: SkillsSceneProps) {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (typeof window !== "undefined") {
            const container = canvasContainerRef.current;
            const hoverTarget = hoverContainerRef.current;
            if (!container || !hoverTarget) return;
            
            // Detect if device is touchscreen
            const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
            
            const scene = new THREE.Scene();
            // Transparent background - don't set scene.background
            const camera = new THREE.PerspectiveCamera(
                75,
                1,
                0.1,
                1000
            );
            // Enable antialiasing for smoother edges and transparent background
            const renderer = new THREE.WebGLRenderer({ 
                antialias: true,
                alpha: true 
            });
            renderer.setClearColor(0x000000, 0); // Transparent background
            renderer.setSize(size, size);
            renderer.setPixelRatio(window.devicePixelRatio); // High-DPI display support
            
            container.appendChild(renderer.domElement);
            camera.position.z = 3;
            camera.position.y = 0.7;
            
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
                            action.timeScale = 2; // 2x speed
                            action.paused = true; // Start paused
                            action.time = 0; // Start at beginning
                            action.play();
                            actions.push(action);
                        });
                        
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
                    action.timeScale = 2; // Play forward at 2x speed
                    action.paused = false;
                });
            };
            
            const handleMouseLeave = () => {
                actions.forEach((action) => {
                    action.timeScale = -2; // Play backward at 2x speed
                    action.paused = false;
                });
            };
            
            // Scroll-driven animation for touch devices
            const handleScroll = () => {
                const rect = container.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const elementCenter = rect.top + rect.height / 2;
                const viewportCenter = windowHeight / 2;
                
                // Calculate how far the element is from viewport center
                // When element is at bottom: distance = positive (windowHeight/2)
                // When element is at center: distance = 0
                // When element is at top: distance = negative (-windowHeight/2)
                const distanceFromCenter = viewportCenter - elementCenter;
                
                // Normalize to 0-1 range based on half viewport height
                let scrollProgress = (distanceFromCenter + windowHeight / 2) / windowHeight;
                
                // Clamp between 0 and 1
                scrollProgress = Math.max(0, Math.min(1, scrollProgress));
                
                // Create triangular wave: 0 -> 1 (at 0.5) -> 0
                let animationProgress;
                // 0-35%: play forward, 35-65%: hold at 100%, 65-100%: play backward
                if (scrollProgress <= 0.35) {
                    // 0% to 35%: animation goes 0% to 100%
                    animationProgress = scrollProgress / 0.35;
                } else if (scrollProgress <= 0.65) {
                    // 35% to 65%: hold at fully animated
                    animationProgress = 1;
                } else {
                    // 65% to 100%: animation goes 100% to 0%
                    animationProgress = (1 - scrollProgress) / 0.35;
                }
                
                // Set animation time based on animation progress
                actions.forEach((action) => {
                    const duration = action.getClip().duration;
                    action.paused = true;
                    action.time = animationProgress * duration;
                });
            };
            
            if (isTouchDevice) {
                window.addEventListener('scroll', handleScroll, { passive: true });
            } else {
                // Mouse-based hover for non-touch devices
                hoverTarget.addEventListener('mouseenter', handleMouseEnter);
                hoverTarget.addEventListener('mouseleave', handleMouseLeave);
            }

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
                if (isTouchDevice) {
                    window.removeEventListener('scroll', handleScroll);
                } else {
                    hoverTarget.removeEventListener('mouseenter', handleMouseEnter);
                    hoverTarget.removeEventListener('mouseleave', handleMouseLeave);
                }
                renderer.dispose();
                if (container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
            };
        }
    }, [hoverContainerRef, size]);
    return <div ref={canvasContainerRef} />;
};