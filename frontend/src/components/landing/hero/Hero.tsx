import DashboardPreview from "./DashboardPreview";
import HeroBackground from "./HeroBackground";
import HeroBadge from "./HeroBadge";
import HeroButtons from "./HeroButtons";
import HeroContent from "./HeroContent";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackground />

      <div className="relative mx-auto flex min-h-[calc(100vh-84px)]  flex-col items-center justify-center px-6 pt-32 pb-10">
        <HeroBadge />

        <HeroContent />

        <HeroButtons />

        <DashboardPreview />
      </div>
    </section>
  );
}
