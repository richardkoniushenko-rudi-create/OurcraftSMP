import { Map, Castle, Cpu, Rocket, MessagesSquare, Wrench } from "lucide-react";

const ICONS = {
  map: Map,
  castle: Castle,
  cpu: Cpu,
  rocket: Rocket,
  chat: MessagesSquare,
  wrench: Wrench,
};

export default function CategoryIcon({ name, size = 14, ...rest }) {
  const C = ICONS[name] || Castle;
  return <C size={size} {...rest} />;
}
