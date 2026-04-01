import { Container, Line } from "@/shared/ui";
import { ChatTrigger } from "@/features/chatbot";

export function HeroSection() {
  return (
    <section aria-label="Identity" className="pt-sm">
      <Container>
        <p className="text-label-sm mb-sm">01 / IDENTITY</p>

        <h1 className="text-huge leading-none">JIM</h1>

        <Line className="my-sm" />

        <div className="grid grid-cols-3 gap-md pb-xl">
          <div className="col-span-2">
            <ChatTrigger />
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-body-intro uppercase leading-tight">
              A digital curator focused on architecting high-performance
              interfaces and robust technical systems.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
