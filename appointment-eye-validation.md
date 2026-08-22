# Appointment FAQ and Clinical Eye Validation

On 22 August 2026, the homepage was reloaded from a fresh development bundle after the appointment FAQ change. The four before-your-visit items rendered beside the appointment call to action, and the first item opened successfully through the browser interaction layer. The clinical eye hitbox was then expanded to cover the full rendered ring extent; browser geometry validation confirmed that every visible ring now falls inside the hover surface (`fullCoverage: true`) and that an edge-area pointer event reaches the interaction target. The FAQ is responsive across desktop and mobile; the eye interaction intentionally remains desktop-only because hover is not a reliable mobile interaction model.

The clinical eye is now exposed as a real interactive control instead of a decorative layer. A desktop pointer-move browser check produced a non-neutral 3D transform (`responded: true`) while the control was above hero content at z-index 4, confirming that full-area mouse hover reliably reaches the model.

The shared touch handler was also exercised with a touch pointer event. It set `aria-pressed="true"` and applied the persistent `is-touch-active` presentation class, confirming that a tap can hold the eye in its focused visual state on touch devices.

The final interaction was validated in a real 375 × 812 mobile browser viewport. A touch press activated the control (`aria-pressed="true"`, `is-touch-active: true`) while its measured bounds did not overlap either the hero headline or the booking button.
