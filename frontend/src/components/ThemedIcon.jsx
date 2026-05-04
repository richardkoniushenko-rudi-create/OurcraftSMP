import {
  Home, PlayCircle, Boxes, Image as ImageIcon, Gamepad2, Trophy,
  Compass, Gavel, Server, Heart, Scale, Book, Sword, Shield, Castle,
  Mountain, Cog, Pickaxe, Sparkles, Feather, Apple, MapPin,
  MessageCircle, Wrench, Package, Github, ArrowUpRight,
} from "lucide-react";

// Central icon registry so any JSON file (rules/timeline/starter) can pick an icon by name
const REG = {
  home: Home,
  play: PlayCircle,
  boxes: Boxes,
  image: ImageIcon,
  gamepad: Gamepad2,
  trophy: Trophy,
  compass: Compass,
  gavel: Gavel,
  server: Server,
  heart: Heart,
  scale: Scale,
  book: Book,
  sword: Sword,
  shield: Shield,
  castle: Castle,
  mountain: Mountain,
  gear: Cog,
  cog: Cog,
  pickaxe: Pickaxe,
  sparkles: Sparkles,
  feather: Feather,
  apple: Apple,
  mappin: MapPin,
  chat: MessageCircle,
  wrench: Wrench,
  package: Package,
  github: Github,
  arrow: ArrowUpRight,
};

export default function ThemedIcon({ name, size = 16, ...rest }) {
  const C = REG[name] || Castle;
  return <C size={size} {...rest} />;
}
