"use client";

import {
  Children,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type Word = { text: string; className?: string };

/* Achata children em palavras, preservando o className de spans de acento
   (ex.: text-gradient-brand). Elementos não-texto são ignorados. */
function flattenToWords(node: React.ReactNode, className?: string): Word[] {
  const words: Word[] = [];
  Children.forEach(node, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      for (const text of String(child).split(/\s+/)) {
        if (text) words.push({ text, className });
      }
    } else if (isValidElement(child)) {
      const props = child.props as {
        children?: React.ReactNode;
        className?: string;
      };
      words.push(...flattenToWords(props.children, cn(className, props.className)));
    }
  });
  return words;
}

type SplitTextProps = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /* "word": escalona palavra a palavra. "line": palavras da mesma linha
     visual sobem juntas (linhas medidas via offsetTop após o layout). */
  per?: "word" | "line";
  /* "inview" anima ao entrar na viewport; "mount" anima no load (hero). */
  mode?: "inview" | "mount";
  stagger?: number;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
};

export function SplitText({
  children,
  as: Tag = "span",
  per = "word",
  mode = "inview",
  stagger,
  delay = 0,
  duration = 0.9,
  className,
  once = true,
}: SplitTextProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const [lineOf, setLineOf] = useState<number[] | null>(null);
  const inView = useInView(rootRef, { once, margin: "-10% 0px" });

  const words = flattenToWords(children);
  /* Pontuação isolada (ex.: "." após um span de acento) cola na palavra
     anterior — sem espaço antes. */
  const isPunct = (t: string) => !/[\p{L}\p{N}]/u.test(t);
  const label = words
    .map((w, i) => (i > 0 && !isPunct(w.text) ? ` ${w.text}` : w.text))
    .join("");
  const gap = stagger ?? (per === "line" ? 0.12 : 0.045);

  useLayoutEffect(() => {
    if (per !== "line" || reduce) return;
    const root = rootRef.current;
    if (!root) return;

    const measure = () => {
      const spans = root.querySelectorAll<HTMLElement>("[data-split-word]");
      const tops: number[] = [];
      const lines: number[] = [];
      spans.forEach((el) => {
        const top = el.offsetTop;
        let idx = tops.findIndex((t) => Math.abs(t - top) < 4);
        if (idx === -1) {
          tops.push(top);
          idx = tops.length - 1;
        }
        lines.push(idx);
      });
      setLineOf(lines);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [per, reduce]);

  if (reduce) {
    return (
      <Tag ref={rootRef as never} className={className}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={mode === "mount" || inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay }}
          className="inline-block"
        >
          {words.map((w, i) => (
            <span key={i} className={w.className}>
              {w.text}
              {i < words.length - 1 && !isPunct(words[i + 1].text) ? " " : null}
            </span>
          ))}
        </motion.span>
      </Tag>
    );
  }

  const shown = mode === "mount" || inView;
  const delayFor = (i: number) =>
    delay + (per === "line" && lineOf ? lineOf[i] : i) * gap;

  return (
    <Tag ref={rootRef as never} aria-label={label} className={className}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          {/* máscara: pb/-mb evitam cortar descendentes (g, p, j) */}
          <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              data-split-word
              initial={{ y: "115%" }}
              animate={shown ? { y: "0%" } : { y: "115%" }}
              transition={{ duration, ease: EASE, delay: delayFor(i) }}
              className={cn("inline-block", w.className)}
            >
              {w.text}
            </motion.span>
          </span>
          {i < words.length - 1 && !isPunct(words[i + 1].text) ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
