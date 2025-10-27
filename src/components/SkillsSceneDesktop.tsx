"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

interface SkillsSceneProps {
    size: number;
    hoverFunction: (value: string | null) => void;
    skillName: string;
    path: string;
}

export default function SkillsScene({
    size,
    hoverFunction,
    skillName,
    path,
}: SkillsSceneProps) {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const hoverContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const container = canvasContainerRef.current;
            const hoverTarget = hoverContainerRef.current;
            if (!container || !hoverTarget) return;

            const scene = new THREE.Scene();
            // Transparent background - don't set scene.background
            const camera = new THREE.OrthographicCamera(
                -1,
                1,
                1,
                -1,
                0.1,
                2000
            );
            // Enable antialiasing for smoother edges and transparent background
            const renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
            });
            renderer.setClearColor(0x000000, 0); // Transparent background
            renderer.setSize(size, size);
            renderer.setPixelRatio(window.devicePixelRatio); // High-DPI display support
            
            // Professional rendering settings
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.5;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            container.appendChild(renderer.domElement);
            camera.position.z = 3;
            camera.position.y = 0.4;

            // Animation mixer for playing model animations
            let mixer: THREE.AnimationMixer | null = null;
            const clock = new THREE.Clock();
            const actions: THREE.AnimationAction[] = [];

            // Load GLB model
            const loader = new GLTFLoader();
            loader.load(
                path,
                (gltf) => {
                    // Model loaded successfully
                    scene.add(gltf.scene);

               

                    // Adjust model position/scale
                    gltf.scene.position.set(0, 0, 0);
                    gltf.scene.scale.set(0.55, 0.55, 0.55);

                    // Calculate bounding box for professional lighting
                    const box = new THREE.Box3().setFromObject(gltf.scene);
                    const size = box.getSize(new THREE.Vector3()).length();
                    const center = box.getCenter(new THREE.Vector3());

                    // Calculate light positions based on model size
                    const dist = size * 1.5;
                    const height = size * 0.6;
                    const side = size * 1.2;

                    // Colors with temperature
                    const keyColor = 0xffe2c6;  // Warm ~3200K
                    const fillColor = 0xcfe6ff; // Cool ~6000K
                    const rimColor = 0xffffff;

                    // A) Key light - SpotLight (main bright directional)
                    const keyLight = new THREE.SpotLight(keyColor, 0.1, dist * 3, Math.PI / 6, 0.3, 1.5);
                    keyLight.position.set(center.x + side, center.y + height, center.z + dist);
                    keyLight.target.position.copy(center);
                    keyLight.castShadow = true;
                    keyLight.shadow.mapSize.set(2048, 2048);
                    keyLight.shadow.bias = -0.0002;
                    keyLight.shadow.normalBias = 0.02;
                    scene.add(keyLight, keyLight.target);

                    // B) Fill light - DirectionalLight (soft, opposite side)
                    const fillLight = new THREE.DirectionalLight(fillColor, 2.0);
                    fillLight.position.set(center.x - side * 1.2, center.y + height * 0.3, center.z + dist * 0.8);
                    fillLight.target.position.copy(center);
                    scene.add(fillLight, fillLight.target);

                    // C) Rim light - DirectionalLight (backlight for edge)
                    const rimLight = new THREE.DirectionalLight(rimColor, 0.2);
                    rimLight.position.set(center.x, center.y + height * 1.2, center.z - dist);
                    rimLight.target.position.copy(center);
                    scene.add(rimLight, rimLight.target);

                    // D) Hemisphere light for ambient "air"
                    const hemiLight = new THREE.HemisphereLight(0xeaf2ff, 0x1b1b1b, 1);
                    scene.add(hemiLight);

                  

                    // Setup animations if they exist
                    if (gltf.animations && gltf.animations.length > 0) {
                        mixer = new THREE.AnimationMixer(gltf.scene);

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
                    gltf.scene.scale.set(0.55, 0.55, 0.55);
                    // gltf.scene.rotation.x = Math.PI / 2;
                },
                undefined,
                (error) => {
                    console.error("Error loading model:", error);
                }
            );

            // Hover event handlers
            const handleMouseEnter = () => {
                hoverFunction(skillName);
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

            // Mouse-based hover for non-touch devices
            hoverTarget.addEventListener("mouseenter", (e) => {
                e.stopPropagation();
                console.log(e.target);
                
                handleMouseEnter();
            });
            hoverTarget.addEventListener("mouseleave", (e) => {
                e.stopPropagation();
                handleMouseLeave();
            });

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
                hoverTarget.removeEventListener("mouseenter", (e) => {
                    e.stopPropagation();
                    handleMouseEnter();
                });
                hoverTarget.removeEventListener("mouseleave", (e) => {
                    e.stopPropagation();
                    handleMouseLeave();
                });
            };
        }
    }, [hoverContainerRef, size]);
    return (
        <div
            className='aspect-square size-[300px] flex items-center justify-center'
            ref={hoverContainerRef}
        >
            <div ref={canvasContainerRef} className='pointer-events-none' />
        </div>
    );
}
