/**
 * HiddenEgg
 * ---------
 * A small clickable element planted around the site. Renders visually
 * subtle until hovered, then opens the EggClaimDialog for that egg.
 */
import { useEffect, useState } from "react";
import axios from "axios";
import EggClaimDialog from "./EggClaimDialog";
import { API } from "../lib/api";

export default function HiddenEgg({
  eggId,
  style = {},
  className = "",
  emoji = "🥚",
  title,
  size = 20,
  children,
}) {
  const [egg, setEgg] = useState(null);
  const [open, setOpen] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/easter/eggs`)
      .then((r) => {
        const found = (r.data || []).find((e) => e.id === eggId);
        if (found) setEgg(found);
      })
      .catch(() => {});
    axios
      .get(`${API}/easter/check/${eggId}`)
      .then((r) => setClaimed(!!r.data?.claimed))
      .catch(() => {});
  }, [eggId]);

  if (claimed) return null; // hide completely once claimed from this IP

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={title || "Something shiny…"}
        data-testid={`hidden-egg-${eggId}`}
        className={`hidden-egg ${className}`}
        style={{
          width: size,
          height: size,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.8,
          lineHeight: 1,
          opacity: 0.18,
          transition: "opacity 200ms ease, transform 200ms ease",
          cursor: "inherit",
          background: "transparent",
          border: "none",
          padding: 0,
          ...style,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "scale(1.35) rotate(-8deg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "0.18";
          e.currentTarget.style.transform = "scale(1) rotate(0deg)";
        }}
      >
        {children || emoji}
      </button>
      <EggClaimDialog
        egg={egg}
        open={open}
        onClose={() => setOpen(false)}
        onClaimed={() => setClaimed(true)}
      />
    </>
  );
}
