"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Galpão de estrutura metálica em wireframe (procedural, sem assets).
 * Pórticos (colunas + tesouras), terças longitudinais, cumeeira e
 * contraventamento nas extremidades. Rotação lenta + parallax de mouse.
 * Auto-gerenciado: cria/dispõe a cena three.js no ciclo de vida do React.
 */
export default function SteelStructure() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(9.5, 5.4, 12.5);
    camera.lookAt(0, 1.1, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // WebGL indisponível — degrada silenciosamente
    }
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    // ---------- geometria do galpão ----------
    const W = 6; // vão (largura)
    const H = 3; // pé-direito (altura da coluna)
    const RIDGE = 4.5; // altura da cumeeira
    const FRAMES = 7; // nº de pórticos
    const SPACING = 1.95;
    const depth = (FRAMES - 1) * SPACING;
    const z0 = -depth / 2;
    const cx = W / 2;

    const linePos: number[] = [];
    const nodePos: number[] = [];
    const seg = (
      ax: number, ay: number, az: number,
      bx: number, by: number, bz: number,
    ) => linePos.push(ax, ay, az, bx, by, bz);

    for (let i = 0; i < FRAMES; i++) {
      const z = z0 + i * SPACING;
      // pórtico (no plano XY)
      seg(-cx, 0, z, -cx, H, z); // coluna esq
      seg(cx, 0, z, cx, H, z); // coluna dir
      seg(-cx, H, z, 0, RIDGE, z); // tesoura esq
      seg(cx, H, z, 0, RIDGE, z); // tesoura dir
      nodePos.push(-cx, 0, z, cx, 0, z, -cx, H, z, cx, H, z, 0, RIDGE, z);

      if (i < FRAMES - 1) {
        const zn = z0 + (i + 1) * SPACING;
        // terças longitudinais (base, beirais, cumeeira)
        seg(-cx, 0, z, -cx, 0, zn);
        seg(cx, 0, z, cx, 0, zn);
        seg(-cx, H, z, -cx, H, zn);
        seg(cx, H, z, cx, H, zn);
        seg(0, RIDGE, z, 0, RIDGE, zn);
        // terças intermediárias sobre as águas do telhado
        const my = (H + RIDGE) / 2;
        seg(-cx / 2, my, z, -cx / 2, my, zn);
        seg(cx / 2, my, z, cx / 2, my, zn);
      }
    }

    // contraventamento (X) nas paredes laterais das baias extremas
    const braceBay = (za: number, zb: number) => {
      seg(-cx, 0, za, -cx, H, zb);
      seg(-cx, 0, zb, -cx, H, za);
      seg(cx, 0, za, cx, H, zb);
      seg(cx, 0, zb, cx, H, za);
    };
    braceBay(z0, z0 + SPACING);
    braceBay(z0 + depth, z0 + depth - SPACING);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePos, 3),
    );
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x79bbef,
      transparent: true,
      opacity: 0.5,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(nodePos, 3),
    );
    const nodeMat = new THREE.PointsMaterial({
      color: 0xcfe6fa,
      size: 0.13,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodes = new THREE.Points(nodeGeo, nodeMat);

    // “chão” técnico — grade sutil
    const grid = new THREE.GridHelper(16, 16, 0x16314a, 0x0e2032);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.35;
    grid.position.y = -0.001;

    const group = new THREE.Group();
    group.add(lines, nodes);
    group.position.y = -1.4;

    const root = new THREE.Group();
    root.add(group);
    const gridGroup = new THREE.Group();
    gridGroup.add(grid);
    gridGroup.position.y = -1.4;
    root.add(gridGroup);
    scene.add(root);

    // ---------- resize ----------
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight || 1;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ---------- parallax de mouse ----------
    let tX = 0, tY = 0, cX = 0, cY = 0;
    const onPointer = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      tX = (e.clientX - r.left) / r.width - 0.5;
      tY = (e.clientY - r.top) / r.height - 0.5;
    };
    mount.addEventListener("pointermove", onPointer);

    // ---------- loop ----------
    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      cX += (tX - cX) * 0.05;
      cY += (tY - cY) * 0.05;
      root.rotation.y = (reduce ? -0.5 : t * 0.1 - 0.3) + cX * 0.5;
      root.rotation.x = -0.05 + cY * 0.18;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mount.removeEventListener("pointermove", onPointer);
      lineGeo.dispose();
      lineMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      grid.geometry.dispose();
      (grid.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}
