import { useEffect, useRef, useState } from "react";
import { Hash, MessageSquare, Users, Send, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { fetchDiscordChat, fetchDiscordInfo, sendDiscordMessage } from "../lib/api";
import { getOrCreateNickname, regenerateNickname } from "../lib/nickname";
import PixelAvatar from "./PixelAvatar";

function relTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}

const FALLBACK = [
  {
    id: "f1",
    author: "Ourcraft",
    content: "Welcome to Ourcraft! Chat bridges to Discord in real-time.",
    bot: true,
    channel: "minecraft-chat",
    timestamp: new Date().toISOString(),
  },
  {
    id: "f2",
    author: "Steve",
    content: "Just finished the mega-base at spawn ✨",
    bot: false,
    channel: "minecraft-chat",
    timestamp: new Date(Date.now() - 60_000).toISOString(),
  },
  {
    id: "f3",
    author: "Alex",
    content: "Anyone up for a Nether expedition tonight?",
    bot: false,
    channel: "minecraft-chat",
    timestamp: new Date(Date.now() - 180_000).toISOString(),
  },
];

export default function DiscordChat({ status, discordUrl }) {
  const [messages, setMessages] = useState([]);
  const [hasData, setHasData] = useState(false);
  const [channelName, setChannelName] = useState("minecraft-chat");
  const scrollRef = useRef(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [data, info] = await Promise.all([
          fetchDiscordChat(20),
          fetchDiscordInfo().catch(() => null),
        ]);
        if (!alive) return;
        if (info?.active_channel_name) {
          // Strip unicode brackets / emojis for cleaner display
          const clean = info.active_channel_name
            .replace(/[〔〕【】「」『』]/g, "")
            .replace(
              /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}]/gu,
              "",
            )
            .trim();
          setChannelName(clean || "minecraft-chat");
        }
        if (Array.isArray(data) && data.length) {
          setMessages(data);
          setHasData(true);
        } else {
          setMessages(FALLBACK);
          setHasData(false);
        }
      } catch {
        setMessages(FALLBACK);
        setHasData(false);
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <section data-testid="discord-chat-section" className="section-pad">
      <div className="container-oc">
        <div className="flex items-center gap-3 mb-6">
          <span className="overline">Live Feed</span>
          <div className="pixel-divider flex-1 max-w-xs" />
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 items-start">
          <div>
            <h2 className="font-pixel text-4xl md:text-5xl text-white">
              In-game chat, <span className="text-[#22c55e]">live.</span>
            </h2>
            <p className="text-white/60 mt-2 max-w-xl">
              Our Discord bot bridges your Minecraft chat to Discord and back.
              See what's happening right now — even before you log in.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#111113] border border-white/10">
                <Users size={14} className="text-[#22c55e]" />
                <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-white/70">
                  {status?.discord_online ?? 0} Online
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#111113] border border-white/10">
                <MessageSquare size={14} className="text-[#22c55e]" />
                <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-white/70">
                  {status?.discord_members ?? 0} Members
                </span>
              </div>
            </div>

            <a
              href={discordUrl}
              target="_blank"
              rel="noreferrer"
              data-testid="discord-invite-button"
              className="block-btn mt-6"
            >
              Join Discord Server
            </a>
          </div>

          <div
            data-testid="chat-window"
            className="block-card overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0d0d0f]">
              <div className="flex items-center gap-2">
                <Hash size={14} className="text-[#22c55e]" />
                <span className="font-pixel text-lg text-white">
                  {channelName}
                </span>
              </div>
              <span
                className={`flex items-center gap-2 font-accent text-[9px] uppercase tracking-[0.2em] ${
                  hasData ? "text-[#22c55e]" : "text-white/40"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 ${
                    hasData ? "bg-[#22c55e] animate-pulse-soft" : "bg-white/30"
                  }`}
                />
                {hasData ? "Live" : "Waiting for bot"}
              </span>
            </div>
            <div
              ref={scrollRef}
              className="h-[300px] overflow-y-auto px-4 py-3 space-y-3 bg-[#0a0a0a]"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  data-testid={`chat-msg-${m.id}`}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {m.avatar ? (
                      <img
                        src={m.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : m.author?.startsWith("[Web") || m.content?.startsWith("**[Web") ? (
                      <PixelAvatar name={m.author || "anon"} size={32} />
                    ) : (
                      <div className="w-full h-full bg-[#22c55e]/15 text-[#22c55e] flex items-center justify-center font-pixel text-lg">
                        {m.author?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span
                        className={`font-pixel text-base ${
                          m.bot ? "text-[#06b6d4]" : "text-white"
                        }`}
                      >
                        {m.author}
                      </span>
                      {m.bot && (
                        <span className="font-accent text-[9px] uppercase tracking-[0.2em] text-[#06b6d4] bg-[#06b6d4]/10 px-1.5">
                          bot
                        </span>
                      )}
                      <span className="text-white/30 text-[10px] font-accent uppercase tracking-wider">
                        {relTime(m.timestamp)}
                      </span>
                    </div>
                    <div className="text-white/80 text-sm break-words">
                      {m.content || <em className="text-white/40">(no text)</em>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <ChatSendBox onSent={() => {/* next poll fetches new msg */}} />
          </div>
        </div>
      </div>
    </section>
  );
}

const PRESETS = [
  "What's cool about this SMP?",
  "How do I begin?",
  "Is it worth joining?",
  "What mods are in the pack?",
];

function ChatSendBox({ onSent }) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    setNickname(getOrCreateNickname());
  }, []);

  const roll = () => {
    setNickname(regenerateNickname());
    toast("New identity rolled", {
      description: "Your next message will use this name.",
    });
  };

  const submit = async (text) => {
    const msg = (text ?? value).trim();
    if (!msg || busy) return;
    setBusy(true);
    try {
      const res = await sendDiscordMessage(msg, nickname || "Anon");
      if (res.sent) {
        toast.success(`Sent as ${nickname}`);
        setValue("");
        onSent?.();
      } else {
        toast.error(res.reason || "Message could not be sent.");
      }
    } catch (e) {
      toast.error("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      data-testid="chat-send-box"
      className="border-t border-white/10 bg-[#0d0d0f] px-4 py-3"
    >
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2 text-[10px]">
          <span className="font-accent uppercase tracking-[0.2em] text-white/40">
            Posting as
          </span>
          <div className="flex items-center gap-2 px-2 py-0.5 bg-[#22c55e]/10 border border-[#22c55e]/30">
            <PixelAvatar name={nickname || "anon"} size={18} />
            <span
              data-testid="nickname-badge"
              className="font-pixel text-sm text-[#22c55e]"
            >
              {nickname || "…"}
            </span>
          </div>
          <button
            type="button"
            onClick={roll}
            data-testid="reroll-name"
            title="Roll a new name"
            className="text-white/40 hover:text-[#22c55e] transition-colors"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            data-testid={`preset-${p.slice(0, 12)}`}
            onClick={() => submit(p)}
            disabled={busy}
            className="font-accent text-[9px] uppercase tracking-[0.15em] text-white/70 bg-[#1a1a1d] border border-white/10 px-2 py-1 transition-all hover:bg-[#22c55e]/15 hover:text-[#22c55e] hover:border-[#22c55e]/40 disabled:opacity-40"
          >
            {p}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex gap-2 items-stretch"
      >
        <input
          data-testid="chat-send-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Ask about the SMP as ${nickname || "…"}…`}
          maxLength={240}
          disabled={busy}
          className="flex-1 bg-[#0a0a0a] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#22c55e]/60 transition-colors"
        />
        <button
          type="submit"
          data-testid="chat-send-btn"
          disabled={busy || !value.trim()}
          className="px-3 bg-[#22c55e] text-black font-accent text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-[#16a34a] hover:shadow-[0_0_18px_rgba(34,197,94,0.5)] disabled:bg-white/10 disabled:text-white/30"
        >
          <Send size={14} />
        </button>
      </form>
      <div className="mt-2 text-[10px] text-white/40 leading-snug">
        Posts to Discord as <span className="text-[#22c55e]">[Web · {nickname || "…"}]</span>.
        Only SMP-related questions are allowed; profanity is blocked.
      </div>
    </div>
  );
}
