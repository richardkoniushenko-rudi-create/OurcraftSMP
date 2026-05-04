/**
 * EggClaimDialog
 * --------------
 * Modal popup that lets a visitor enter their Minecraft username
 * to claim an easter egg reward. Backend validates uniqueness per IP + username.
 */
import { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { X, Gift, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { API } from "../lib/api";

export default function EggClaimDialog({ egg, open, onClose, onClaimed }) {
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  useEffect(() => {
    if (!open) {
      setUsername("");
      setResult(null);
      setAlreadyClaimed(false);
      return;
    }
    // On open, check if the egg has already been claimed by this IP
    if (egg?.id) {
      axios
        .get(`${API}/easter/check/${egg.id}`)
        .then((r) => setAlreadyClaimed(!!r.data?.claimed))
        .catch(() => {});
    }
  }, [open, egg]);

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!username.trim() || busy) return;
    setBusy(true);
    try {
      const r = await axios.post(`${API}/easter/claim`, {
        egg_id: egg.id,
        mc_username: username.trim(),
      });
      setResult(r.data);
      if (r.data?.ok) {
        toast.success("Egg claimed! Reward request sent to the server.", {
          description: r.data.reward,
        });
        onClaimed?.(egg.id);
      } else {
        toast.error(r.data?.reason || "Could not claim the egg.");
      }
    } catch {
      toast.error("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && egg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[250] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="block-card p-5 md:p-6 max-w-md w-full bg-[#0d0d0f]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="overline">Easter Egg · Claim</div>
                <div className="font-pixel text-2xl text-white mt-1">
                  {egg.emoji} {egg.name}
                </div>
                <div className="text-xs text-white/50 mt-1">{egg.hint}</div>
              </div>
              <button
                onClick={onClose}
                className="block-btn !px-2.5 !py-2"
                data-testid="egg-close"
              >
                <X size={14} />
              </button>
            </div>

            <div className="block-card p-4 bg-gradient-to-br from-[#22c55e]/10 to-transparent mb-4">
              <div className="flex items-center gap-2">
                <Gift size={14} className="text-[#22c55e]" />
                <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-[#22c55e]">
                  Reward
                </span>
              </div>
              <div className="font-pixel text-xl text-white mt-1">
                {egg.reward}
              </div>
            </div>

            {result?.ok ? (
              <div className="block-card p-4 border-[#22c55e]/40 bg-[#22c55e]/10">
                <div className="flex items-center gap-2 text-[#22c55e]">
                  <CheckCircle2 size={16} />
                  <span className="font-pixel text-lg">Reward Requested!</span>
                </div>
                <p className="text-white/70 text-sm mt-2">
                  Staff have been notified. Log into the server — your{" "}
                  <span className="text-[#22c55e]">{result.reward}</span> will
                  arrive within 24 hours.
                </p>
              </div>
            ) : alreadyClaimed || result?.already_claimed ? (
              <div className="block-card p-4 border-amber-400/40 bg-amber-400/10">
                <div className="flex items-center gap-2 text-amber-300">
                  <AlertTriangle size={16} />
                  <span className="font-pixel text-lg">Already claimed</span>
                </div>
                <p className="text-white/70 text-sm mt-2">
                  This egg has already been unlocked from this device or
                  account. Each egg can only be claimed once.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-3">
                <label
                  htmlFor="mc-username"
                  className="font-accent text-[10px] uppercase tracking-[0.2em] text-white/50"
                >
                  Your Minecraft Java username
                </label>
                <input
                  id="mc-username"
                  data-testid="egg-username-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Notch"
                  maxLength={16}
                  className="bg-[#0a0a0a] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#22c55e]/60 transition-colors"
                  autoFocus
                />
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    data-testid="egg-claim-btn"
                    disabled={busy || !username.trim()}
                    className="block-btn flex-1 disabled:opacity-40"
                  >
                    {busy ? "Claiming…" : "Claim Reward"}
                  </button>
                </div>
                {result?.reason && !result.already_claimed && (
                  <div className="text-xs text-red-400">{result.reason}</div>
                )}
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
