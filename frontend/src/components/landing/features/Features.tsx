import SectionHeading from "./SectionHeading";
import FeatureCard from "./FeatureCard";
import { features } from "./features";

export default function Features() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading />

        <div className="mt-20 space-y-32">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
