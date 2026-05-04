import ModsPageInner from "./ModsPageInner";
import HiddenEgg from "../components/HiddenEgg";

export default function ModsPage() {
  return (
    <div style={{ position: "relative" }}>
      <ModsPageInner />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 160,
          right: 80,
          zIndex: 2,
        }}
      >
        <HiddenEgg eggId="mods_golden_apple" emoji="🍏" size={20} />
      </div>
    </div>
  );
}
