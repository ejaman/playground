import { Container } from "@/shared/ui";
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

      {/* 03 Writing + 04 About
          Mobile: 단일 컬럼 / Desktop: 2fr + 1fr */}
      <section aria-label="Writing and About" className="py-lg" id="blog">
        <Container>
          {/* <Line className="mb-xl" /> */}
          <div className="flex flex-col gap-xl md:grid md:grid-cols-[2fr_1fr]">
            <WritingSection />
            <AboutSection />
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
