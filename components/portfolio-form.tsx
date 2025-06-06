"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Trash2 } from "lucide-react"
import { z } from "zod"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// Define the form schema
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name is required" }),
  title: z.string().min(2, { message: "Title is required" }),
  about: z.string().min(10, { message: "About section is required" }),
  themeColor: z.enum(["blue", "purple", "green"]),
  roles: z.string(),
  profileImage: z.string().optional(),
  skills: z.string(),
  experience: z.array(
    z.object({
      company: z.string().min(1, { message: "Company is required" }),
      role: z.string().min(1, { message: "Role is required" }),
      duration: z.string().min(1, { message: "Duration is required" }),
      description: z.string(),
    }),
  ),
  projects: z.array(
    z.object({
      name: z.string().min(1, { message: "Project name is required" }),
      description: z.string(),
      technologies: z.string(),
      link: z.string().url().or(z.literal("")),
    }),
  ),
  education: z.array(
    z.object({
      school: z.string().min(1, { message: "School/College is required" }),
      degree: z.string().min(1, { message: "Degree is required" }),
      year: z.string().min(1, { message: "Year is required" }),
    }),
  ),
})

type FormValues = z.infer<typeof formSchema>

// Default values for the form
const defaultValues: FormValues = {
  fullName: "",
  title: "",
  about: "",
  themeColor: "blue",
  roles: "",
  profileImage: "",
  skills: "",
  experience: [{ company: "", role: "", duration: "", description: "" }],
  projects: [{ name: "", description: "", technologies: "", link: "" }],
  education: [{ school: "", degree: "", year: "" }],
}

export function PortfolioForm() {
  const router = useRouter()
  const [skillInput, setSkillInput] = useState("")
  const [activeTab, setActiveTab] = useState("basic")

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedData = localStorage.getItem("portfolioFormData")
        if (savedData) {
          const parsedData = JSON.parse(savedData)
          form.reset(parsedData)
          toast.success("Previous form data loaded")
        }
      } catch (error) {
        console.error("Error loading form data:", error)
      }
    }
  }, [form])

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("portfolioFormData", JSON.stringify(data))
        } catch (error) {
          console.error("Error saving form data:", error)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  // Use field arrays for repeatable sections
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: "experience",
  })

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control: form.control,
    name: "projects",
  })

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "education",
  })

  // Handle form submission
  function onSubmit(data: FormValues) {
    // Transform data for API submission
    const transformedData = {
      ...data,
      roles: data.roles.split(",").map(s => s.trim()).filter(Boolean),
      skills: data.skills.split(",").map(s => s.trim()).filter(Boolean),
      projects: data.projects.map(project => ({
        ...project,
        technologies: project.technologies.split(",").map(s => s.trim()).filter(Boolean)
      }))
    }
    
    // Save the form data to localStorage
    localStorage.setItem("portfolioFormData", JSON.stringify(data))
    
    // Navigate to the generated portfolio page with the form data
    router.push(`/portfolio?data=${encodeURIComponent(JSON.stringify(transformedData))}`)
  }

  // Handle adding skills with comma or enter key
  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const currentSkills = form.getValues("skills").split(",").filter(Boolean)
      const newSkill = skillInput.trim()

      if (newSkill && !currentSkills.includes(newSkill)) {
        const updatedSkills = [...currentSkills, newSkill].join(",")
        form.setValue("skills", updatedSkills)
      }

      setSkillInput("")
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Generate Your Portfolio</CardTitle>
        <CardDescription>Fill in your details to create a personalized portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Frontend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roles (for typing animation)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Full Stack Developer, UI/UX Designer, Problem Solver (comma separated)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Enter roles separated by commas for the typing animation</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/your-image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>Enter a URL to your profile image</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About You</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write a brief introduction about yourself..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="themeColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theme Color</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a theme color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Input
                            placeholder="Add skills (comma separated or press Enter)"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleSkillInputKeyDown}
                          />
                          <div className="flex flex-wrap gap-2 mt-2">
                            {field.value
                              .split(",")
                              .filter(Boolean)
                              .map((skill, index) => (
                                <Badge key={index} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter your skills separated by commas or press Enter after each skill
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="experience" className="space-y-6">
                {experienceFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        if (experienceFields.length > 1) {
                          removeExperience(index)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <FormField
                      control={form.control}
                      name={`experience.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`experience.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input placeholder="Your position" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`experience.${index}.duration`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="Jan 2020 - Present" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`experience.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe your responsibilities and achievements" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    appendExperience({
                      company: "",
                      role: "",
                      duration: "",
                      description: "",
                    })
                  }
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Experience
                </Button>
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                {projectFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        if (projectFields.length > 1) {
                          removeProject(index)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <FormField
                      control={form.control}
                      name={`projects.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Project name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`projects.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe your project" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`projects.${index}.technologies`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technologies Used</FormLabel>
                          <FormControl>
                            <Input placeholder="React, Node.js, MongoDB (comma separated)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`projects.${index}.link`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Link</FormLabel>
                          <FormControl>
                            <Input placeholder="https://github.com/yourusername/project" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    appendProject({
                      name: "",
                      description: "",
                      technologies: "",
                      link: "",
                    })
                  }
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </TabsContent>

              <TabsContent value="education" className="space-y-6">
                {educationFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        if (educationFields.length > 1) {
                          removeEducation(index)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <FormField
                      control={form.control}
                      name={`education.${index}.school`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School/College</FormLabel>
                          <FormControl>
                            <Input placeholder="University name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`education.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree</FormLabel>
                          <FormControl>
                            <Input placeholder="Bachelor of Science in Computer Science" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`education.${index}.year`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input placeholder="2018 - 2022" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    appendEducation({
                      school: "",
                      degree: "",
                      year: "",
                    })
                  }
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Education
                </Button>
              </TabsContent>
            </Tabs>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Generate Portfolio
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  localStorage.removeItem("portfolioFormData")
                  form.reset(defaultValues)
                  toast.success("Form data cleared")
                }}
                className="w-auto"
              >
                Clear Data
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
