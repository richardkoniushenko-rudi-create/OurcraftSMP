import { useEffect, useState } from "react";
import { fetchServerInfo, fetchServerStatus } from "../lib/api";

export default function useServerData() {
  const [info, setInfo] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let alive = true;

    const loadInfo = async () => {
      try {
        const d = await fetchServerInfo();
        if (alive) setInfo(d);
      } catch {
        /* ignore */
      }
    };
    const loadStatus = async () => {
      try {
        const d = await fetchServerStatus();
        if (alive) setStatus(d);
      } catch {
        /* ignore */
      }
    };

    loadInfo();
    loadStatus();
    const id = setInterval(loadStatus, 10000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return { info, status };
}
