"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default function TitleScene() {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (typeof window !== "undefined") {
            const container = canvasContainerRef.current;
            if (!container) return;

            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xffffff); // White background like Spline
            
            // Use perspective camera for more realistic rendering
            const camera = new THREE.PerspectiveCamera(
                50,
                container.clientWidth / container.clientHeight,
                0.1,
                2000
            );
            camera.setFocalLength(200);
            
            // Enable antialiasing for smoother edges
            const renderer = new THREE.WebGLRenderer({
                antialias: true,
            });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio); // High-DPI display support
            // Professional rendering settings
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.5;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            container.appendChild(renderer.domElement);
            
            // Function to get camera Z position based on screen width
            const getCameraZ = () => {
                const width = window.innerWidth;
                if (width >= 1920) return 18;      // 3xl: >= 1920px (largest screens)
                if (width >= 1680) return 20;    // Between 3xl and 2xl
                if (width >= 1280) return 22;      // xl: >= 1280px
                if (width >= 768) return 24;       // md: >= 768px
                if (width >= 640) return 28;     // sm: >= 640px
                return 30;                       // xxs: < 480px (smallest screens)
            };
            
            camera.position.z = getCameraZ();
            // camera.position.z = 20;
            camera.position.y = 3.3;
            camera.position.x = 0.03

            // Animation setup
            let mixer: THREE.AnimationMixer | null = null;
            const clock = new THREE.Clock();
            const animationMap = new Map<string, THREE.AnimationAction>();
            let cleanupMouseMove: (() => void) | null = null;
            let modelScene: THREE.Group | null = null;
            let originalPosition: THREE.Vector3 | null = null;
            
            // Mouse tracking for model rotation
            const targetRotation = { x: 0, y: 0 };
            const currentRotation = { x: 0, y: 0 };
            const mousePosition = { x: 0, y: 0 };

            // Load GLB model
            const loader = new GLTFLoader();
            const modelPath = "/models/MATVEI_1.glb"; // Update this path to your model
            loader.load(
                modelPath,
                (gltf) => {
                    // Model loaded successfully

                    // Adjust model position/scale
                    gltf.scene.position.set(0, 0, 0);
                    gltf.scene.scale.set(1, 1, 1);

                    gltf.scene.rotation.y = -0.2
                    // Calculate bounding box to find the actual center of the model
                    const box = new THREE.Box3().setFromObject(gltf.scene);
                    const size = box.getSize(new THREE.Vector3()).length();
                    const center = box.getCenter(new THREE.Vector3());
                    
                    
                    // Create a pivot group at the visual center
                    const pivotGroup = new THREE.Group();
                    pivotGroup.position.copy(center); // Position pivot at visual center
                    
                    // Offset the model within the pivot group so it stays in its current position
                    gltf.scene.position.set(-center.x, -center.y, -center.z);
                    
                    // Parent model to pivot group
                    pivotGroup.add(gltf.scene);
                    
                    // Add pivot group to scene
                    scene.add(pivotGroup);
                    
                    // Store reference to pivot for rotation
                    modelScene = pivotGroup;
                    
                    // Store original position
                    originalPosition = pivotGroup.position.clone();

                    // Calculate light positions based on model size
                    // Use the center for proper lighting
                    const lightCenter = center.clone();
                    const dist = size * 1.5;
                    const height = size * 0.6;
                    const side = size * 1.2;

                    // Colors with temperature
                    const keyColor = 0xffe2c6;  // Warm ~3200K
                    const fillColor = 0xcfe6ff; // Cool ~6000K
                    const rimColor = 0xffffff;

                    // A) Key light - SpotLight (main bright directional)
                    const keyLight = new THREE.SpotLight(keyColor, 0.1, dist * 3, Math.PI / 6, 0.3, 1.5);
                    keyLight.position.set(lightCenter.x + side, lightCenter.y + height, lightCenter.z + dist);
                    keyLight.target.position.copy(lightCenter);
                    keyLight.castShadow = true;
                    keyLight.shadow.mapSize.set(2048, 2048);
                    keyLight.shadow.bias = -0.0002;
                    keyLight.shadow.normalBias = 0.02;
                    scene.add(keyLight, keyLight.target);

                    // B) Fill light - DirectionalLight (soft, opposite side)
                    const fillLight = new THREE.DirectionalLight(fillColor, 2.0);
                    fillLight.position.set(lightCenter.x - side * 1.2, lightCenter.y + height * 0.3, lightCenter.z + dist * 0.8);
                    fillLight.target.position.copy(lightCenter);
                    scene.add(fillLight, fillLight.target);

                    // C) Rim light - DirectionalLight (backlight for edge)
                    const rimLight = new THREE.DirectionalLight(rimColor, 0.2);
                    rimLight.position.set(lightCenter.x, lightCenter.y + height * 1.2, lightCenter.z - dist);
                    rimLight.target.position.copy(lightCenter);
                    scene.add(rimLight, rimLight.target);

                    // D) Hemisphere light for ambient "air"
                    const hemiLight = new THREE.HemisphereLight(0xeaf2ff, 0x1b1b1b, 1);
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
                    
                  
                    // Find each trigger mesh by name and store with its animation
                    interface TriggerMeshData {
                        mesh: THREE.Mesh;
                        animation: THREE.AnimationAction | undefined;
                        isHovered: boolean;
                    }
                    
                    const triggers: TriggerMeshData[] = [];
                    
                    // Find MATtrigger mesh
                    const matMesh = gltf.scene.getObjectByName('MATtrigger') as THREE.Mesh;
                    if (matMesh) {
                        const anim = animationMap.get('M_Action.002');
                        triggers.push({
                            mesh: matMesh,
                            animation: anim,
                            isHovered: false
                        });
                    }
                    
                    // Find VEItrigger mesh
                    const veiMesh = gltf.scene.getObjectByName('VEItrigger') as THREE.Mesh;
                    if (veiMesh) {
                        const anim = animationMap.get('V_Action.002');
                        triggers.push({
                            mesh: veiMesh,
                            animation: anim,
                            isHovered: false
                        });
                    }
                    
                    // Find BRUMtrigger mesh
                    const brumMesh = gltf.scene.getObjectByName('BRUMtrigger') as THREE.Mesh;
                    if (brumMesh) {
                        const anim = animationMap.get('B_Action.002');
                        triggers.push({
                            mesh: brumMesh,
                            animation: anim,
                            isHovered: false
                        });
                    }
                    
                    // Find BERGtrigger mesh
                    const bergMesh = gltf.scene.getObjectByName('BERGtrigger') as THREE.Mesh;
                    if (bergMesh) {
                        const anim = animationMap.get('B_2_Action.002');
                        triggers.push({
                            mesh: bergMesh,
                            animation: anim,
                            isHovered: false
                        });
                    }
                    

                    // Check if device is touchscreen
                    const isTouchScreen = window.matchMedia('(pointer: coarse)').matches;

                    // Auto-play animations sequentially on touchscreen devices
                    if (isTouchScreen && triggers.length > 0) {
                        let currentTriggerIndex = 0;
                        const forwardDuration = 1000; // 1 second to play forward at 2x speed
                        
                        const playNextAnimation = () => {
                            const trigger = triggers[currentTriggerIndex];
                            
                            if (trigger.animation) {
                                
                                // Play forward
                                trigger.animation.timeScale = 2;
                                trigger.animation.paused = false;
                                trigger.animation.play();
                                
                                // After forward duration, play backward AND start next animation
                                setTimeout(() => {
                                    if (trigger.animation) {
                                        trigger.animation.timeScale = -2;
                                        trigger.animation.paused = false;
                                        trigger.animation.play();
                                    }
                                    
                                    // Start next animation immediately
                                    currentTriggerIndex = (currentTriggerIndex + 1) % triggers.length;
                                    playNextAnimation();
                                }, forwardDuration);
                            }
                        };
                        
                        // Start the animation loop after initial delay
                        setTimeout(playNextAnimation, 1000);
                    }

                    // Raycaster for hover detection
                    const raycaster = new THREE.Raycaster();
                    const mouse = new THREE.Vector2();

                    const onMouseMove = (event: MouseEvent) => {
                        const rect = renderer.domElement.getBoundingClientRect();
                        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                        // Update mouse position for model rotation (normalized -1 to 1)
                        mousePosition.x = mouse.x;
                        mousePosition.y = mouse.y;
                        
                        // Calculate target rotation based on mouse position (very subtle)
                        targetRotation.y = mousePosition.x * -0.015; // Max 0.15 radians (~8.6 degrees)
                        targetRotation.x = mousePosition.y * 0.01;  // Max 0.1 radians (~5.7 degrees)

                        // Only do hover interactions on non-touch devices
                        if (!isTouchScreen) {
                            raycaster.setFromCamera(mouse, camera);
                            
                            let foundHover = false;

                            // Check each trigger mesh individually
                            triggers.forEach((trigger, index) => {
                                const intersects = raycaster.intersectObject(trigger.mesh, false);
                                
                                if (intersects.length > 0) {
                                    // Mouse is hovering this mesh
                                    foundHover = true;
                                    if (!trigger.isHovered) {
                                        // Just started hovering
                                        trigger.isHovered = true;
                                        
                                        if (trigger.animation) {
                                            trigger.animation.timeScale = 2; // Play forward at 2x speed
                                            trigger.animation.paused = false;
                                            trigger.animation.play(); // Ensure it's playing
                                        } else {
                                        }
                                        
                                        renderer.domElement.style.cursor = 'pointer';
                                    }
                                } else {
                                    // Mouse is not hovering this mesh
                                    if (trigger.isHovered) {
                                        // Just stopped hovering
                                        trigger.isHovered = false;
                                        
                                        if (trigger.animation) {
                                            trigger.animation.timeScale = -2; // Play backward at 2x speed
                                            trigger.animation.paused = false;
                                            trigger.animation.play(); // Ensure it's playing
                                        }
                                    }
                                }
                            });
                            
                            // Reset cursor if not hovering any mesh
                            if (!foundHover) {
                                renderer.domElement.style.cursor = 'default';
                            }
                        }
                    };

                    renderer.domElement.addEventListener('mousemove', onMouseMove);
                    
                    // Store cleanup function for this listener
                    cleanupMouseMove = () => {
                        renderer.domElement.removeEventListener('mousemove', onMouseMove);
                    };
                },
                undefined,
                (error) => {
                    console.error("Error loading model:", error);
                }
            );

            // Animation loop (needed to render continuously)
            let frameCount = 0;
            const animate = () => {
                requestAnimationFrame(animate);

                // Update animations
                const delta = clock.getDelta();
                if (mixer) {
                    mixer.update(delta);
                    
                    frameCount++;
                }
                
                // Smoothly rotate model to follow mouse
                if (modelScene && originalPosition) {
                    const lerpFactor = 0.05; // Smoothness factor (lower = smoother)
                    
                    // Lerp current rotation towards target rotation
                    currentRotation.x += (targetRotation.x - currentRotation.x) * lerpFactor;
                    currentRotation.y += (targetRotation.y - currentRotation.y) * lerpFactor;
                    
                    // Apply rotation to model
                    modelScene.rotation.x = currentRotation.x;
                    modelScene.rotation.y = currentRotation.y;
                    
                    // Ensure position stays constant
                    modelScene.position.copy(originalPosition);
                }

                renderer.render(scene, camera);
            };
            animate();

            // Handle window resize
            const handleResize = () => {
                if (!container) return;
                const width = container.clientWidth;
                const height = container.clientHeight;
                
                camera.aspect = width / height;
                camera.position.z = getCameraZ(); // Update camera Z position on resize
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            };
            window.addEventListener("resize", handleResize);

            // Cleanup
            return () => {
                window.removeEventListener("resize", handleResize);
                
                // Clean up mouse move listener if it exists
                if (cleanupMouseMove) {
                    cleanupMouseMove();
                }
                
                renderer.dispose();
                if (container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
            };
        }
    }, []);
    
    return (
        <div className='relative w-screen flex justify-start z-40'>
            <div 
                ref={canvasContainerRef} 
                className='h-[calc(100dvh-10rem)] w-screen z-40'
                style={{ height: "calc(100dvh - 10rem)", width: "100vw" }}
            />
            <div className="absolute bottom-0 right-0 w-full h-20 bg-white z-50"></div>
        </div>
    );
}
