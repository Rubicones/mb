"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default function SplineLogo() {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    
    useEffect(() => {
        if (typeof window !== "undefined") {
            const container = canvasContainerRef.current;
            if (!container || rendererRef.current) return;

            const scene = new THREE.Scene();
            
            const camera = new THREE.PerspectiveCamera(
                50,
                60/90,
                0.1,
                2000
            );
            camera.setFocalLength(200);
            
            let renderer: THREE.WebGLRenderer | null = null;
            try {
                renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true,
                });
            } catch (error) {
                console.warn("LogoScene: Failed to create WebGL context", error);
                return;
            }
            rendererRef.current = renderer;
            renderer.setSize(60, 90);
            renderer.setPixelRatio(window.devicePixelRatio);
            
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.5;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            container.appendChild(renderer.domElement);
            
            camera.position.z = 18;
            camera.position.y = 1.35;

            let mixer: THREE.AnimationMixer | null = null;
            const clock = new THREE.Clock();
            const animationMap = new Map<string, THREE.AnimationAction>();

            const loader = new GLTFLoader();
            const modelPath = "/models/MB.glb";
            loader.load(
                modelPath,
                (gltf) => {
                    gltf.scene.position.set(0, 0, 0);
                    gltf.scene.scale.set(1.8, 1.8, 1.8);
                    
                    const box = new THREE.Box3().setFromObject(gltf.scene);
                    const size = box.getSize(new THREE.Vector3()).length();
                    const center = box.getCenter(new THREE.Vector3());
                    
                    const pivotGroup = new THREE.Group();
                    pivotGroup.position.copy(center);
                    
                    gltf.scene.position.set(-center.x, -center.y, -center.z);
                    
                    pivotGroup.add(gltf.scene);
                    
                    scene.add(pivotGroup);

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

                    const rimLight = new THREE.DirectionalLight(rimColor, 0.2);
                    rimLight.position.set(lightCenter.x, lightCenter.y + height * 1.2, lightCenter.z - dist);
                    rimLight.target.position.copy(lightCenter);
                    scene.add(rimLight, rimLight.target);

                    const hemiLight = new THREE.HemisphereLight(0xeaf2ff, 0x1b1b1b, 0.7);
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
                },
                undefined,
                (error) => {
                    console.error("Error loading model:", error);
                }
            );

            let isHovering = false;

            const onMouseEnter = () => {
                if (!isHovering) {
                    isHovering = true;
                    container.style.cursor = 'pointer';
                    
                    animationMap.forEach((action) => {
                        action.timeScale = 1.5;
                        action.paused = false;
                        action.play();
                    });
                }
            };

            const onMouseLeave = () => {
                if (isHovering) {
                    isHovering = false;
                    container.style.cursor = 'default';
                    
                    animationMap.forEach((action) => {
                        action.timeScale = -1.5;
                        action.paused = false;
                        action.play();
                    });
                }
            };

            container.addEventListener('mouseenter', onMouseEnter);
            container.addEventListener('mouseleave', onMouseLeave);

            const animate = () => {
                requestAnimationFrame(animate);

                const delta = clock.getDelta();
                if (mixer) {
                    mixer.update(delta);
                }

                renderer.render(scene, camera);
            };
            animate();

            return () => {
                container.removeEventListener('mouseenter', onMouseEnter);
                container.removeEventListener('mouseleave', onMouseLeave);
                
                rendererRef.current?.dispose();
                if (container.contains(renderer!.domElement)) {
                    container.removeChild(renderer!.domElement);
                }
                rendererRef.current = null;
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
