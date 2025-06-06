import { Navbar } from "@/components/navbar"
import { PortfolioForm } from "@/components/portfolio-form"
import { DottedBackground } from "@/components/dotted-background"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <DottedBackground />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Navbar />
        <div className="mt-16 mb-24">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">Portfolio Generator</h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Create your professional portfolio in minutes
          </p>
          <PortfolioForm />
        </div>
      </div>
    </main>
  )
}
