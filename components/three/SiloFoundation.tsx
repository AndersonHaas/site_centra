"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

/**
 * Fundação de silo em wireframe procedural (sem assets): estacas
 * profundas, blocos de coroamento, anel de fundação com armadura e
 * arranque do costado. A câmera percorre um caminho subsolo → anel →
 * costado dirigido pelo progresso de scroll (MotionValue), com parallax
 * fino de mouse. Cada etapa "acende" quando a câmera passa por ela.
 * Auto-gerenciado no ciclo de vida do React (padrão do SteelStructure).
 */
export default function SiloFoundation({
  progress,
}: {
  progress?: MotionValue<number>;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<MotionValue<number> | undefined>(progress);
  progressRef.current = progress;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // WebGL indisponível — degrada silenciosamente
    }
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    // ---------- helpers de geometria ----------
    const seg = (
      arr: number[],
      ax: number, ay: number, az: number,
      bx: number, by: number, bz: number,
    ) => arr.push(ax, ay, az, bx, by, bz);

    const circle = (arr: number[], y: number, r: number, n = 64) => {
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * Math.PI * 2;
        const a1 = ((i + 1) / n) * Math.PI * 2;
        seg(
          arr,
          Math.cos(a0) * r, y, Math.sin(a0) * r,
          Math.cos(a1) * r, y, Math.sin(a1) * r,
        );
      }
    };

    // ---------- dimensões ----------
    const R = 2.5; // raio do anel de fundação
    const PILES = 12;
    const PILE_TOP = -0.35;
    const PILE_BOT = -2.9;
    const RING_TOP = 0.3;
    const SHELL_R = 2.35;
    const SHELL_H = 3.4;

    // ---------- etapa 1: estacas + blocos de coroamento ----------
    const pileLines: number[] = [];
    const pileNodes: number[] = [];
    for (let i = 0; i < PILES; i++) {
      const a = (i / PILES) * Math.PI * 2;
      const x = Math.cos(a) * R;
      const z = Math.sin(a) * R;
      seg(pileLines, x, PILE_BOT, z, x, PILE_TOP, z);
      pileNodes.push(x, PILE_TOP, z, x, PILE_BOT, z);
      // bloco de coroamento (arestas de caixa)
      const h = 0.26;
      const y0 = PILE_TOP;
      const y1 = PILE_TOP + 0.3;
      const c = [
        [-h, -h], [h, -h], [h, h], [-h, h],
      ] as const;
      for (let k = 0; k < 4; k++) {
        const [dx0, dz0] = c[k];
        const [dx1, dz1] = c[(k + 1) % 4];
        seg(pileLines, x + dx0, y0, z + dz0, x + dx1, y0, z + dz1);
        seg(pileLines, x + dx0, y1, z + dz0, x + dx1, y1, z + dz1);
        seg(pileLines, x + dx0, y0, z + dz0, x + dx0, y1, z + dz0);
      }
    }
    // estacas centrais sob a laje
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const x = Math.cos(a) * 1.1;
      const z = Math.sin(a) * 1.1;
      seg(pileLines, x, PILE_BOT, z, x, PILE_TOP, z);
      pileNodes.push(x, PILE_TOP, z);
    }

    // ---------- etapa 2: anel de fundação + armadura ----------
    const ringLines: number[] = [];
    const rebarLines: number[] = [];
    const boltNodes: number[] = [];
    circle(ringLines, PILE_TOP + 0.3, R + 0.35);
    circle(ringLines, PILE_TOP + 0.3, R - 0.35);
    circle(ringLines, RING_TOP, R + 0.35);
    circle(ringLines, RING_TOP, R - 0.35);
    // montantes verticais do anel + travessas radiais no topo
    const RADIALS = 24;
    for (let i = 0; i < RADIALS; i++) {
      const a = (i / RADIALS) * Math.PI * 2;
      const co = Math.cos(a);
      const si = Math.sin(a);
      seg(ringLines, co * (R + 0.35), PILE_TOP + 0.3, si * (R + 0.35), co * (R + 0.35), RING_TOP, si * (R + 0.35));
      seg(ringLines, co * (R - 0.35), PILE_TOP + 0.3, si * (R - 0.35), co * (R - 0.35), RING_TOP, si * (R - 0.35));
      seg(ringLines, co * (R - 0.35), RING_TOP, si * (R - 0.35), co * (R + 0.35), RING_TOP, si * (R + 0.35));
    }
    // armadura: circunferências internas (acento azul)
    circle(rebarLines, PILE_TOP + 0.55, R - 0.15, 48);
    circle(rebarLines, PILE_TOP + 0.55, R + 0.15, 48);
    circle(rebarLines, RING_TOP - 0.12, R, 48);
    // laje de fundo interna
    circle(ringLines, RING_TOP, 1.6, 48);
    circle(ringLines, RING_TOP, 0.8, 32);
    // chumbadores (pontos) no círculo do costado
    for (let i = 0; i < RADIALS; i++) {
      const a = (i / RADIALS) * Math.PI * 2;
      boltNodes.push(Math.cos(a) * SHELL_R, RING_TOP, Math.sin(a) * SHELL_R);
    }

    // ---------- etapa 3: arranque do costado ----------
    const shellLines: number[] = [];
    const shellNodes: number[] = [];
    const STIFF = 24;
    circle(shellLines, RING_TOP, SHELL_R);
    for (let i = 0; i < STIFF; i++) {
      const a = (i / STIFF) * Math.PI * 2;
      const x = Math.cos(a) * SHELL_R;
      const z = Math.sin(a) * SHELL_R;
      seg(shellLines, x, RING_TOP, z, x, RING_TOP + SHELL_H, z);
      shellNodes.push(x, RING_TOP + SHELL_H, z);
    }
    for (let k = 1; k <= 4; k++) {
      circle(shellLines, RING_TOP + (SHELL_H / 4) * k, SHELL_R);
    }

    // ---------- materiais e grupos (opacidade animada por etapa) ----------
    const mkLines = (pos: number[], color: number, opacity: number) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      const m = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
      });
      return { obj: new THREE.LineSegments(g, m), geo: g, mat: m };
    };
    const mkPoints = (pos: number[], color: number, size: number) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      const m = new THREE.PointsMaterial({
        color,
        size,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      return { obj: new THREE.Points(g, m), geo: g, mat: m };
    };

    const piles = mkLines(pileLines, 0x79bbef, 0.34);
    const pilesPts = mkPoints(pileNodes, 0xcfe6fa, 0.11);
    const ring = mkLines(ringLines, 0x79bbef, 0.34);
    const rebar = mkLines(rebarLines, 0x4aa0e6, 0.45);
    const bolts = mkPoints(boltNodes, 0xcfe6fa, 0.1);
    const shell = mkLines(shellLines, 0x79bbef, 0.34);
    const shellPts = mkPoints(shellNodes, 0xcfe6fa, 0.1);

    const disposables = [piles, pilesPts, ring, rebar, bolts, shell, shellPts];

    /* Cada etapa acende quando o progresso passa por ela. */
    const stages = [
      { mats: [piles.mat, pilesPts.mat], center: 1 / 6, base: 0.3, gain: 0.5 },
      { mats: [ring.mat, bolts.mat], center: 0.5, base: 0.3, gain: 0.5 },
      { mats: [rebar.mat], center: 0.5, base: 0.38, gain: 0.55 },
      { mats: [shell.mat, shellPts.mat], center: 5 / 6, base: 0.3, gain: 0.5 },
    ];

    const root = new THREE.Group();
    root.add(
      piles.obj, pilesPts.obj,
      ring.obj, rebar.obj, bolts.obj,
      shell.obj, shellPts.obj,
    );

    // solo: grade técnica + limite da escavação
    const grid = new THREE.GridHelper(16, 16, 0x16314a, 0x0e2032);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.3;
    grid.position.y = 0;
    const excav: number[] = [];
    circle(excav, 0.005, 3.6, 64);
    seg(excav, -4.4, 0.005, 0, 4.4, 0.005, 0);
    seg(excav, 0, 0.005, -4.4, 0, 0.005, 4.4);
    const excavL = mkLines(excav, 0x79bbef, 0.2);
    disposables.push(excavL);
    root.add(grid, excavL.obj);

    scene.add(root);

    // ---------- câmera: caminho subsolo → anel → costado → topo ----------
    const KEYS = [
      { pos: new THREE.Vector3(3.9, -1.8, 4.6), look: new THREE.Vector3(0, -1.3, 0) },
      { pos: new THREE.Vector3(4.5, 0.6, 5.2), look: new THREE.Vector3(0, -0.2, 0) },
      { pos: new THREE.Vector3(3.9, 2.4, 4.6), look: new THREE.Vector3(0, 1.4, 0) },
      { pos: new THREE.Vector3(4.8, 4.8, 5.6), look: new THREE.Vector3(0, 1.9, 0) },
    ];
    const tmpPos = new THREE.Vector3();
    const tmpLook = new THREE.Vector3();
    const setCam = (p: number) => {
      const t = p * (KEYS.length - 1);
      const i = Math.min(Math.floor(t), KEYS.length - 2);
      let f = t - i;
      f = f * f * (3 - 2 * f); // smoothstep por trecho
      tmpPos.lerpVectors(KEYS[i].pos, KEYS[i + 1].pos, f);
      tmpLook.lerpVectors(KEYS[i].look, KEYS[i + 1].look, f);
      camera.position.copy(tmpPos);
      camera.lookAt(tmpLook);
    };

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
    if (!reduce) window.addEventListener("pointermove", onPointer);

    // ---------- loop ----------
    let raf = 0;
    const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
    const animate = () => {
      const mv = progressRef.current;
      const p = reduce
        ? 0.45
        : mv
          ? clamp01(mv.get())
          : 0.45;
      setCam(p);
      cX += (tX - cX) * 0.05;
      cY += (tY - cY) * 0.05;
      root.rotation.y = -0.35 + p * 1.0 + cX * 0.35;
      root.rotation.x = cY * 0.1;
      for (const s of stages) {
        const w = Math.max(0, 1 - Math.abs(p - s.center) * 3.2);
        for (const m of s.mats) m.opacity = s.base + w * s.gain;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      for (const d of disposables) {
        d.geo.dispose();
        d.mat.dispose();
      }
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
