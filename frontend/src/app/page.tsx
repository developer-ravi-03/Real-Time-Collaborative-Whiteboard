// import Hero from "@/components/landing/hero";
// import Features from "@/components/landing/features";
// import WhyChoose from "@/components/landing/WhyChoose";

// export default function HomePage() {
//   return (
//     <main>
//       <Hero />
//       <Features />
//       <WhyChoose />
//     </main>
//   );
// }

import { Navbar } from "@/components/common/navbar";
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="mx-auto flex min-h-[calc(100vh-84px)] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Real-Time Collaboration
        </p>

        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Build together.
          <br />
          <span className="text-muted-foreground">In real time.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          SyncBoard is a real-time collaborative whiteboard for teams,
          classrooms and projects.
        </p>
      </section>
    </main>
  );
}
