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
            scene.background = new THREE.Color(0xffffff);
            
            const camera = new THREE.PerspectiveCamera(
                50,
                container.clientWidth / container.clientHeight,
                0.1,
                2000
            );
            camera.setFocalLength(200);
            
            const renderer = new THREE.WebGLRenderer({
                antialias: true,
            });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.5;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            container.appendChild(renderer.domElement);
            
            const getCameraZ = () => {
                const width = window.innerWidth;
                if (width >= 1920) return 18;
                if (width >= 1680) return 20;
                if (width >= 1280) return 22;
                if (width >= 768) return 24;
                if (width >= 640) return 28;
                return 30;
            };
            
            camera.position.z = getCameraZ();
            camera.position.y = 3.3;
            camera.position.x = 0.03

            let mixer: THREE.AnimationMixer | null = null;
            const clock = new THREE.Clock();
            const animationMap = new Map<string, THREE.AnimationAction>();
            let cleanupMouseMove: (() => void) | null = null;
            let modelScene: THREE.Group | null = null;
            let originalPosition: THREE.Vector3 | null = null;
            
            const targetRotation = { x: 0, y: 0 };
            const currentRotation = { x: 0, y: 0 };
            const mousePosition = { x: 0, y: 0 };

            const loader = new GLTFLoader();
            const modelPath = "/models/MATVEI_1.glb";
            loader.load(
                modelPath,
                (gltf) => {
                    gltf.scene.position.set(0, 0, 0);
                    gltf.scene.scale.set(1, 1, 1);

                    gltf.scene.rotation.y = -0.2
                    const box = new THREE.Box3().setFromObject(gltf.scene);
                    const size = box.getSize(new THREE.Vector3()).length();
                    const center = box.getCenter(new THREE.Vector3());
                    
                    
                    const pivotGroup = new THREE.Group();
                    pivotGroup.position.copy(center);
                    gltf.scene.position.set(-center.x, -center.y, -center.z);
                    
                    pivotGroup.add(gltf.scene);
                    
                    scene.add(pivotGroup);
                    
                    modelScene = pivotGroup;
                    
                    originalPosition = pivotGroup.position.clone();

                    const lightCenter = center.clone();
                    const dist = size * 1.5;
                    const height = size * 0.6;
                    const side = size * 1.2;

                    const keyColor = 0xffe2c6;
                    const fillColor = 0xcfe6ff;
                    const rimColor = 0xffffff;

                    const keyLight = new THREE.SpotLight(keyColor, 0.1, dist * 3, Math.PI / 6, 0.3, 1.5);
                    keyLight.position.set(lightCenter.x + side, lightCenter.y + height, lightCenter.z + dist);
                    keyLight.target.position.copy(lightCenter);
                    keyLight.castShadow = true;
                    keyLight.shadow.mapSize.set(2048, 2048);
                    keyLight.shadow.bias = -0.0002;
                    keyLight.shadow.normalBias = 0.02;
                    scene.add(keyLight, keyLight.target);

                    const fillLight = new THREE.DirectionalLight(fillColor, 2.0);
                    fillLight.position.set(lightCenter.x - side * 1.2, lightCenter.y + height * 0.3, lightCenter.z + dist * 0.8);
                    fillLight.target.position.copy(lightCenter);
                    scene.add(fillLight, fillLight.target);

                    const hemiLight = new THREE.HemisphereLight(0xeaf2ff, 0x1b1b1b, 1);
                    scene.add(hemiLight);

                    if (gltf.animations && gltf.animations.length > 0) {
                        mixer = new THREE.AnimationMixer(gltf.scene);

                        gltf.animations.forEach((clip) => {
                            const action = mixer!.clipAction(clip);
                            action.setLoop(THREE.LoopOnce, 1);
                            action.clampWhenFinished = true;
                            action.time = 0;
                            action.play();
                            action.paused = true;
                            animationMap.set(clip.name, action);
                        });
                    }
                    
                  
                    interface TriggerMeshData {
                        mesh: THREE.Mesh;
                        animation: THREE.AnimationAction | undefined;
                        isHovered: boolean;
                    }
                    
                    const triggers: TriggerMeshData[] = [];
                    
                    const matMesh = gltf.scene.getObjectByName('MATtrigger') as THREE.Mesh;
                    if (matMesh) {
                        const anim = animationMap.get('M_Action.002');
                        triggers.push({
                            mesh: matMesh,
                            animation: anim,
                            isHovered: false
                        });
                    }
                    
                    const veiMesh = gltf.scene.getObjectByName('VEItrigger') as THREE.Mesh;
                    if (veiMesh) {
                        const anim = animationMap.get('V_Action.002');
                        triggers.push({
                            mesh: veiMesh,
                            animation: anim,
                            isHovered: false
                        });
                    }
                    
                    const brumMesh = gltf.scene.getObjectByName('BRUMtrigger') as THREE.Mesh;
                    if (brumMesh) {
                        const anim = animationMap.get('B_Action.002');
                        triggers.push({
                            mesh: brumMesh,
                            animation: anim,
                            isHovered: false
                        });
                    }
                    
                    const bergMesh = gltf.scene.getObjectByName('BERGtrigger') as THREE.Mesh;
                    if (bergMesh) {
                        const anim = animationMap.get('B_2_Action.002');
                        triggers.push({
                            mesh: bergMesh,
                            animation: anim,
                            isHovered: false
                        });
                    }
                    

                    const isTouchScreen = window.matchMedia('(pointer: coarse)').matches;

                    if (isTouchScreen && triggers.length > 0) {
                        let currentTriggerIndex = 0;
                        const forwardDuration = 1000;
                        
                        const playNextAnimation = () => {
                            const trigger = triggers[currentTriggerIndex];
                            
                            if (trigger.animation) {
                                
                                trigger.animation.timeScale = 2;
                                trigger.animation.paused = false;
                                trigger.animation.play();
                                
                                setTimeout(() => {
                                    if (trigger.animation) {
                                        trigger.animation.timeScale = -2;
                                        trigger.animation.paused = false;
                                        trigger.animation.play();
                                    }
                                    
                                    currentTriggerIndex = (currentTriggerIndex + 1) % triggers.length;
                                    playNextAnimation();
                                }, forwardDuration);
                            }
                        };
                        
                        setTimeout(playNextAnimation, 1000);
                    }

                    const raycaster = new THREE.Raycaster();
                    const mouse = new THREE.Vector2();

                    const onMouseMove = (event: MouseEvent) => {
                        const rect = renderer.domElement.getBoundingClientRect();
                        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                        mousePosition.x = mouse.x;
                        mousePosition.y = mouse.y;
                        
                        targetRotation.y = mousePosition.x * -0.015;
                        targetRotation.x = mousePosition.y * 0.01;

                        if (!isTouchScreen) {
                            raycaster.setFromCamera(mouse, camera);
                            
                            let foundHover = false;

                            triggers.forEach((trigger, index) => {
                                const intersects = raycaster.intersectObject(trigger.mesh, false);
                                
                                if (intersects.length > 0) {
                                    foundHover = true;
                                    if (!trigger.isHovered) {
                                        trigger.isHovered = true;
                                        
                                        if (trigger.animation) {
                                            trigger.animation.timeScale = 2;
                                            trigger.animation.paused = false;
                                            trigger.animation.play();
                                        } else {
                                        }
                                        
                                        renderer.domElement.style.cursor = 'pointer';
                                    }
                                } else {
                                    if (trigger.isHovered) {
                                        trigger.isHovered = false;
                                        
                                        if (trigger.animation) {
                                            trigger.animation.timeScale = -2;
                                            trigger.animation.paused = false;
                                            trigger.animation.play();
                                        }
                                    }
                                }
                            });
                            
                            if (!foundHover) {
                                renderer.domElement.style.cursor = 'default';
                            }
                        }
                    };

                    renderer.domElement.addEventListener('mousemove', onMouseMove);
                    
                    cleanupMouseMove = () => {
                        renderer.domElement.removeEventListener('mousemove', onMouseMove);
                    };
                },
                undefined,
                (error) => {
                    console.error("Error loading model:", error);
                }
            );

            let frameCount = 0;
            const animate = () => {
                requestAnimationFrame(animate);

                const delta = clock.getDelta();
                if (mixer) {
                    mixer.update(delta);
                    
                    frameCount++;
                }
                
                if (modelScene && originalPosition) {
                    const lerpFactor = 0.05;
                    
                    currentRotation.x += (targetRotation.x - currentRotation.x) * lerpFactor;
                    currentRotation.y += (targetRotation.y - currentRotation.y) * lerpFactor;
                    
                    modelScene.rotation.x = currentRotation.x;
                    modelScene.rotation.y = currentRotation.y;
                    
                    modelScene.position.copy(originalPosition);
                }

                renderer.render(scene, camera);
            };
            animate();

            const handleResize = () => {
                if (!container) return;
                const width = container.clientWidth;
                const height = container.clientHeight;
                
                camera.aspect = width / height;
                camera.position.z = getCameraZ();
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            };
            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize);
                
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
        <div className='relative w-screen flex justify-start'>
            <div 
                ref={canvasContainerRef} 
                className='h-[calc(100dvh-10rem)] w-screen'
                style={{ height: "calc(100dvh - 10rem)", width: "100vw" }}
            />
            <div className="absolute bottom-0 right-0 w-full h-20 bg-white"></div>
        </div>
    );
}
