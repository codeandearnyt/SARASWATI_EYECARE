import { useState } from "react";

export default function ClinicalOrbit() {
  const [touchFocused, setTouchFocused] = useState(false);
  const toggleTouchFocus = () => {
    setTouchFocused(active => !active);
  };

  return <button type="button" className={`clinical-orbit-hitbox${touchFocused ? " is-touch-active" : ""}`} aria-label="Tap to explore the clinical eye model" aria-pressed={touchFocused} onPointerDown={event => { if (event.pointerType !== "mouse") toggleTouchFocus(); }} onClick={event => { if (event.detail === 0) toggleTouchFocus(); }}>
    <div className="clinical-orbit-wrap">
      <div className="clinical-orbit">
        <span className="orbit-ring ring-a" /><span className="orbit-ring ring-b" /><span className="orbit-ring ring-c" />
        <span className="orbital-node node-a" /><span className="orbital-node node-b" /><span className="orbital-node node-c" />
        <div className="orbit-lens"><span /><span /><span /></div>
        <div className="orbit-copy">VISION<br />IN FOCUS</div>
      </div>
    </div>
    <span className="clinical-orbit-hint">Tap to explore</span>
  </button>;
}
