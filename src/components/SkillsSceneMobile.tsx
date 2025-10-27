"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

interface SkillsSceneProps {
    hoverContainerRef: React.RefObject<HTMLAnchorElement | null>;
    size: number;
    path: string;
}

export default function SkillsScene({
    hoverContainerRef,
    size,
    path,
}: SkillsSceneProps) {
    const canvasContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const container = canvasContainerRef.current;
            const hoverTarget = hoverContainerRef.current;
            if (!container || !hoverTarget) return;

            // Detect if device is touchscreen
            const isTouchDevice =
                window.matchMedia("(pointer: coarse)").matches;

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

                    // Calculate bounding box for professional lighting
                    const box = new THREE.Box3().setFromObject(gltf.scene);
                    const size = box.getSize(new THREE.Vector3()).length();
                    const center = box.getCenter(new THREE.Vector3());

                    // Calculate light positions based on model size
                    const dist = size * 1.5;
                    const height = size * 0.6;
                    const side = size * 1.2;

                    // Colors with temperature
                    const keyColor = 0xffe2c6; // Warm ~3200K
                    const fillColor = 0xcfe6ff; // Cool ~6000K
                    const rimColor = 0xffffff;

                    // A) Key light - SpotLight (main bright directional)
                    const keyLight = new THREE.SpotLight(
                        keyColor,
                        0.1,
                        dist * 3,
                        Math.PI / 6,
                        0.3,
                        1.5
                    );
                    keyLight.position.set(
                        center.x + side,
                        center.y + height,
                        center.z + dist
                    );
                    keyLight.target.position.copy(center);
                    keyLight.castShadow = true;
                    keyLight.shadow.mapSize.set(2048, 2048);
                    keyLight.shadow.bias = -0.0002;
                    keyLight.shadow.normalBias = 0.02;
                    scene.add(keyLight, keyLight.target);

                    // B) Fill light - DirectionalLight (soft, opposite side)
                    const fillLight = new THREE.DirectionalLight(
                        fillColor,
                        2.0
                    );
                    fillLight.position.set(
                        center.x - side * 1.2,
                        center.y + height * 0.3,
                        center.z + dist * 0.8
                    );
                    fillLight.target.position.copy(center);
                    scene.add(fillLight, fillLight.target);

                    // C) Rim light - DirectionalLight (backlight for edge)
                    const rimLight = new THREE.DirectionalLight(rimColor, 0.2);
                    rimLight.position.set(
                        center.x,
                        center.y + height * 1.2,
                        center.z - dist
                    );
                    rimLight.target.position.copy(center);
                    scene.add(rimLight, rimLight.target);

                    // D) Hemisphere light for ambient "air"
                    const hemiLight = new THREE.HemisphereLight(
                        0xeaf2ff,
                        0x1b1b1b,
                        1
                    );
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
                    if (path === "/models/3D_skill_1.glb")
                        gltf.scene.position.set(-0.2, -0.3, 0);
                    else if (path === "/models/2D_MODEL_2.glb")
                        gltf.scene.position.set(-0.2, -0.45, 0);
                    else if (path === "/models/tools3.glb")
                        gltf.scene.position.set(0, -0.3, 0);

                    gltf.scene.scale.set(0.53, 0.53, 0.53);
                    // gltf.scene.rotation.x = Math.PI / 2;
                },
                undefined,
                (error) => {
                    console.error("Error loading model:", error);
                }
            );

            // Hover event handlers
            const handleMouseEnter = () => {
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
                let scrollProgress =
                    (distanceFromCenter + windowHeight / 2) / windowHeight;

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
                window.addEventListener("scroll", handleScroll, {
                    passive: true,
                });
            } else {
                // Mouse-based hover for non-touch devices
                hoverTarget.addEventListener("mouseenter", handleMouseEnter);
                hoverTarget.addEventListener("mouseleave", handleMouseLeave);
            }

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
                    window.removeEventListener("scroll", handleScroll);
                } else {
                    hoverTarget.removeEventListener(
                        "mouseenter",
                        handleMouseEnter
                    );
                    hoverTarget.removeEventListener(
                        "mouseleave",
                        handleMouseLeave
                    );
                }
                renderer.dispose();
                if (container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
            };
        }
    }, [hoverContainerRef, size]);
    return (
        <div className='aspect-square flex items-center justify-center'>
            <div ref={canvasContainerRef} />
        </div>
    );
}
