import { Check } from "lucide-react";
import FeatureVisual from "./FeatureVisual";

type Feature = {
  title: string;
  description: string;
  points: string[];
  icon: React.ElementType;
};

export default function FeatureCard({
  feature,
  reverse,
}: {
  feature: Feature;
  reverse: boolean;
}) {
  const Icon = feature.icon;

  return (
    <div
      className={`grid items-center gap-16 lg:grid-cols-2 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* Left */}

      <div>
        <div className="mb-6 inline-flex rounded-2xl bg-primary/10 p-4 text-primary">
          <Icon size={28} />
        </div>

        <h3 className="text-4xl font-bold">{feature.title}</h3>

        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          {feature.description}
        </p>

        <div className="mt-8 grid gap-4">
          {feature.points.map((point) => (
            <div key={point} className="flex items-center gap-3">
              <div className="rounded-full bg-green-500/15 p-1">
                <Check className="h-4 w-4 text-green-500" />
              </div>

              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}

      <FeatureVisual title={feature.title} />
    </div>
  );
}
