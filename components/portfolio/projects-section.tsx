"use client"

import { useInView } from "framer-motion"
import { useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectItem {
  name: string
  description: string
  technologies: string[]
  link: string
}

export function ProjectsSection({
  id,
  projects,
}: {
  id: string
  projects: ProjectItem[]
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id={id} className="py-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-theme">Projects</h2>
          <div className="h-1 w-20 bg-theme"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-theme">{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  {project.link && (
                    <CardFooter>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button variant="outline" className="w-full">
                          {project.link.includes("github") ? (
                            <Github className="mr-2 h-4 w-4" />
                          ) : (
                            <ExternalLink className="mr-2 h-4 w-4" />
                          )}
                          View Project
                        </Button>
                      </a>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
