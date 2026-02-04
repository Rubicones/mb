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
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const container = canvasContainerRef.current;
            const hoverTarget = hoverContainerRef.current;
            if (!container || !hoverTarget || rendererRef.current) return;

            const isTouchDevice =
                window.matchMedia("(pointer: coarse)").matches;

            const scene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(
                -1,
                1,
                1,
                -1,
                0.1,
                2000
            );
            let renderer: THREE.WebGLRenderer | null = null;
            try {
                renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true,
                });
            } catch (error) {
                console.warn("SkillsScene: Failed to create WebGL context", error);
                return;
            }
            rendererRef.current = renderer;
            renderer.setClearColor(0x000000, 0);
            renderer.setSize(size, size);
            renderer.setPixelRatio(window.devicePixelRatio);

            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.5;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            container.appendChild(renderer.domElement);
            camera.position.z = 3;

            let mixer: THREE.AnimationMixer | null = null;
            const clock = new THREE.Clock();
            const actions: THREE.AnimationAction[] = [];

            const loader = new GLTFLoader();
            loader.load(
                path,
                (gltf) => {
                    scene.add(gltf.scene);

                    const box = new THREE.Box3().setFromObject(gltf.scene);
                    const size = box.getSize(new THREE.Vector3()).length();
                    const center = box.getCenter(new THREE.Vector3());

                    const dist = size * 1.5;
                    const height = size * 0.6;
                    const side = size * 1.2;

                    const keyColor = 0xffe2c6;
                    const fillColor = 0xcfe6ff;
                    const rimColor = 0xffffff;

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

                    const rimLight = new THREE.DirectionalLight(rimColor, 0.2);
                    rimLight.position.set(
                        center.x,
                        center.y + height * 1.2,
                        center.z - dist
                    );
                    rimLight.target.position.copy(center);
                    scene.add(rimLight, rimLight.target);

                    const hemiLight = new THREE.HemisphereLight(
                        0xeaf2ff,
                        0x1b1b1b,
                        1
                    );
                    scene.add(hemiLight);

                    if (gltf.animations && gltf.animations.length > 0) {
                        mixer = new THREE.AnimationMixer(gltf.scene);

                        gltf.animations.forEach((clip) => {
                            const action = mixer!.clipAction(clip);
                            action.setLoop(THREE.LoopOnce, 1);
                            action.clampWhenFinished = true;
                            action.timeScale = 2;
                            action.paused = true;
                            action.time = 0;
                            action.play();
                            actions.push(action);
                        });
                    }

                    if (path === "/models/3D_skill_1.glb")
                        gltf.scene.position.set(-0.2, -0.3, 0);
                    else if (path === "/models/2D_MODEL_2.glb")
                        gltf.scene.position.set(-0.1, -0.55, 0);
                    else if (path === "/models/Tool_new.glb")
                        gltf.scene.position.set(0.05, -0.3, 0);

                    gltf.scene.scale.set(0.55, 0.55, 0.55);
                },
                undefined,
                (error) => {
                    console.error("Error loading model:", error);
                }
            );

            const handleMouseEnter = () => {
                actions.forEach((action) => {
                    action.timeScale = 2;
                    action.paused = false;
                });
            };

            const handleMouseLeave = () => {
                actions.forEach((action) => {
                    action.timeScale = -2;
                    action.paused = false;
                });
            };

            const handleScroll = () => {
                const rect = container.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const elementCenter = rect.top + rect.height / 2;
                const viewportCenter = windowHeight / 2;

                const distanceFromCenter = viewportCenter - elementCenter;

                let scrollProgress =
                    (distanceFromCenter + windowHeight / 2) / windowHeight;

                scrollProgress = Math.max(0, Math.min(1, scrollProgress));

                let animationProgress;
                if (scrollProgress <= 0.35) {
                    animationProgress = scrollProgress / 0.35;
                } else if (scrollProgress <= 0.65) {
                    animationProgress = 1;
                } else {
                    animationProgress = (1 - scrollProgress) / 0.35;
                }

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
                hoverTarget.addEventListener("mouseenter", handleMouseEnter);
                hoverTarget.addEventListener("mouseleave", handleMouseLeave);
            }

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
                rendererRef.current?.dispose();
                if (container.contains(renderer!.domElement)) {
                    container.removeChild(renderer!.domElement);
                }
                rendererRef.current = null;
            };
        }
    }, [hoverContainerRef, size]);
    return (
        <div className='aspect-square flex items-center justify-center'>
            <div ref={canvasContainerRef} />
        </div>
    );
}
