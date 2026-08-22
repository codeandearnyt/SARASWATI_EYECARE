import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useState } from "react";

export default function ClinicalOrbit() {
  const [touchFocused, setTouchFocused] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-18, 18]), { stiffness: 165, damping: 15 });
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [15, -15]), { stiffness: 165, damping: 15 });
  const scale = useSpring(useTransform(pointerY, [-0.5, 0.5], [0.94, 1.08]), { stiffness: 165, damping: 15 });
  const y = useSpring(useTransform(pointerY, [-0.5, 0.5], [10, -12]), { stiffness: 165, damping: 15 });

  const trackPointer = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - .5);
    pointerY.set((event.clientY - rect.top) / rect.height - .5);
  };

  const resetPointer = () => { pointerX.set(0); pointerY.set(0); };

  const toggleTouchFocus = () => {
    setTouchFocused(active => {
      const next = !active;
      pointerX.set(next ? .18 : 0);
      pointerY.set(next ? -.16 : 0);
      return next;
    });
  };

  return <button type="button" className={`clinical-orbit-hitbox${touchFocused ? " is-touch-active" : ""}`} aria-label="Explore the clinical eye model" aria-pressed={touchFocused} onPointerEnter={trackPointer} onPointerMove={trackPointer} onPointerLeave={event => { if (event.pointerType !== "touch") resetPointer(); }} onPointerDown={event => { if (event.pointerType !== "mouse") toggleTouchFocus(); }} onClick={event => { if (event.detail === 0) toggleTouchFocus(); }}>
    <div className="clinical-orbit-wrap">
      <motion.div className="clinical-orbit" style={{ rotateX, rotateY, scale, y }}>
        <span className="orbit-ring ring-a" /><span className="orbit-ring ring-b" /><span className="orbit-ring ring-c" />
        <span className="orbital-node node-a" /><span className="orbital-node node-b" /><span className="orbital-node node-c" />
        <div className="orbit-lens"><span /><span /><span /></div>
        <div className="orbit-copy">VISION<br />IN FOCUS</div>
      </motion.div>
    </div>
    <span className="clinical-orbit-hint">Tap to explore</span>
  </button>;
}
