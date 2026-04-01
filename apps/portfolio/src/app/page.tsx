import { Container, Line } from "@/shared/ui";
import {
  Header,
  HeroSection,
  PhilosophySection,
  ProjectsSection,
  WritingSection,
  AboutSection,
  Footer,
} from "@/widgets";

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <HeroSection />
      <PhilosophySection />
      <ProjectsSection />

      {/* 03 Writing + 04 About — desktop: 2/3 + 1/3 side by side */}
      <section aria-label="Writing and About" className="py-lg" id="blog">
        <Container>
          <Line className="mb-xl" />
          <div className="grid grid-cols-1 gap-xl md:grid-cols-[2fr_1fr]">
            <WritingSection />
            <AboutSection />
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
