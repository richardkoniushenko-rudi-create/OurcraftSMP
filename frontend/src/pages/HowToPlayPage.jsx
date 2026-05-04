import HowToPlay from "@/components/HowToPlay";

export default function HowToPlayPage({ info }) {
  return (
    <div data-testid="how-to-play-page" className="pt-20">
      <HowToPlay info={info} />
    </div>
  );
}
