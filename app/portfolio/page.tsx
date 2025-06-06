"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { DottedBackground } from "@/components/dotted-background"
import { AboutSection } from "@/components/portfolio/about-section"
import { SkillsSection } from "@/components/portfolio/skills-section"
import { ExperienceSection } from "@/components/portfolio/experience-section"
import { ProjectsSection } from "@/components/portfolio/projects-section"
import { EducationSection } from "@/components/portfolio/education-section"
import { HeroSection } from "@/components/portfolio/hero-section"
import { PortfolioNavbar } from "@/components/portfolio/portfolio-navbar"

export default function PortfolioPage() {
  const searchParams = useSearchParams()
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const dataParam = searchParams.get("data")
      if (dataParam) {
        const data = JSON.parse(decodeURIComponent(dataParam))
        setPortfolioData(data)

        // Apply theme color
        if (data.themeColor) {
          document.documentElement.classList.add(`theme-${data.themeColor}`)
        }
      }
    } catch (error) {
      console.error("Failed to parse portfolio data:", error)
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!portfolioData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Portfolio data not found</h1>
        <p className="mb-8 text-muted-foreground">Please go back and fill out the portfolio form</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Form
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-background text-foreground`}>
      <DottedBackground />
      <PortfolioNavbar name={portfolioData.fullName} />

      <div className="container mx-auto px-4 relative z-10">
        <HeroSection
          name={portfolioData.fullName}
          title={portfolioData.title}
          roles={portfolioData.roles}
          profileImage={portfolioData.profileImage}
        />

        <AboutSection id="about" about={portfolioData.about} />

        <SkillsSection id="skills" skills={portfolioData.skills} />

        <ExperienceSection id="experience" experience={portfolioData.experience} />

        <ProjectsSection id="projects" projects={portfolioData.projects} />

        <EducationSection id="education" education={portfolioData.education} />

        <div className="flex justify-center py-12 gap-4">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Resume
          </Button>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Edit Info
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
