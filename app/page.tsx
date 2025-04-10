"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"
import {
  Download,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { portfolioConfig } from "./config"
import { useMobile } from "@/hooks/use-mobile"

export default function Portfolio() {
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [currentProject, setCurrentProject] = useState(0)
  const isMobile = useMobile()
  const projectsRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [activeTab, setActiveTab] = useState("education")
  const [deviceOrientation, setDeviceOrientation] = useState({ beta: 0, gamma: 0 })

  // Track device orientation for mobile
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        setDeviceOrientation({
          beta: event.beta, // Front/back tilt
          gamma: event.gamma, // Left/right tilt
        })
      }
    }

    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation)
    }

    return () => {
      if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", handleOrientation)
      }
    }
  }, [])

  // Track scroll position for active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "skills", "education", "projects", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle project navigation
  const nextProject = () => {
    setCurrentProject((prev) => (prev === portfolioConfig.projects.length - 1 ? 0 : prev + 1))
  }

  const prevProject = () => {
    setCurrentProject((prev) => (prev === 0 ? portfolioConfig.projects.length - 1 : prev - 1))
  }

  // Handle touch events for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      nextProject()
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      prevProject()
    }
  }

  if (!mounted) return null

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background text-foreground relative"
    >
      {/* Mobile Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t py-2">
          <div className="flex justify-around">
            {[
              { id: "home", label: "Home", icon: "🏠" },
              { id: "about", label: "About", icon: "👤" },
              { id: "skills", label: "Skills", icon: "🛠️" },
              { id: "education", label: "Edu", icon: "🎓" },
              { id: "projects", label: "Projects", icon: "💼" },
              { id: "contact", label: "Contact", icon: "📞" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`flex flex-col items-center p-1 ${
                  activeSection === item.id ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/80 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold hover:scale-105 transition-transform duration-300"
          >
            {portfolioConfig.name}
          </motion.h1>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6">
              {[
                { id: "about", label: "About" },
                { id: "skills", label: "Skills" },
                { id: "education", label: "Education" },
                { id: "projects", label: "Projects" },
                { id: "contact", label: "Contact" },
              ].map((item, index) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`hover:text-primary transition-all hover:scale-110 relative ${
                    activeSection === item.id ? "text-primary font-medium" : ""
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.span
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 min-h-[90vh] flex items-center">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:w-1/2"
          >
            <TypingAnimation text="Hi, I'm SabariVasan" className="text-4xl md:text-7xl font-bold mb-6" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="text-xl md:text-2xl text-muted-foreground mb-8 hover:scale-105 transition-transform duration-300"
              style={{
                transform: isMobile
                  ? `rotateX(${deviceOrientation.beta * 0.1}deg) rotateY(${deviceOrientation.gamma * 0.1}deg)`
                  : "none",
                transition: "transform 0.2s ease-out",
              }}
            >
              <div className="masked-text-container">
                <h2 className="masked-text">{portfolioConfig.title}</h2>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              <button
                className="glow-on-hover mt-4 flex items-center justify-center"
                onClick={() =>
                  window.open(
                    "https://drive.google.com/file/d/1jm742q5G10V6nVK7dSxN3SvafEU5J-sq/view?usp=sharing",
                    "_blank",
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" />
                <span>Download Resume</span>
              </button>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:w-1/2 mt-10 md:mt-0 flex justify-center"
            style={{
              transform: isMobile
                ? `rotateX(${deviceOrientation.beta * 0.05}deg) rotateY(${deviceOrientation.gamma * 0.05}deg)`
                : "none",
              transition: "transform 0.2s ease-out",
            }}
          >
            <motion.div
              className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileInView={{
                boxShadow: ["0 0 0 0 rgba(var(--primary-rgb), 0.7)", "0 0 0 20px rgba(var(--primary-rgb), 0)"],
              }}
              transition={{
                boxShadow: {
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                },
              }}
            >
              <img
                src="https://avatars.githubusercontent.com/u/144119741?v=4"
                alt="SabariVasan S.M"
                className="object-cover w-full h-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section - Career Objective with Card Flip */}
      <section id="about" className="py-20 bg-[#121212]">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <AnimatedHeading text="Career Objective" />

            {/* Card with flip effect - Dark Theme */}
            <div className="max-w-3xl mx-auto card">
              <div className="card-inner">
                <div className="card-front">
                  <h3 className="text-xl font-semibold">
                    " Mechanical Precision, IT Efficiency, Future-Ready Solutions "
                  </h3>
                </div>
                <div className="card-back">
                  <p className="text-base">
                    A motivated and detail-oriented individual with a background in Mechanical Engineering and current
                    studies in Information Technology, aiming to apply technical and problem-solving skills in web
                    development and IT solutions.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center mt-6 text-sm text-gray-400">
              <span className="inline-block animate-pulse bg-indigo-500 w-2 h-2 rounded-full mr-2"></span>
              Hover over the card to reveal more
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Skills Section - Categorized */}
      <section id="skills" className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <AnimatedHeading text="Skills" />

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    category: "Languages",
                    skills: [
                      {
                        name: "Python",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
                      },
                      {
                        name: "JavaScript",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
                      },
                    ],
                  },
                  {
                    category: "Front End",
                    skills: [
                      {
                        name: "HTML",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
                      },
                      {
                        name: "CSS",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
                      },
                      {
                        name: "JS",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
                      },
                      {
                        name: "TypeScript",
                        icon: "https://cdn.worldvectorlogo.com/logos/typescript.svg",
                      },
                    ],
                  },
                  {
                    category: "Framework",
                    skills: [
                      {
                        name: "React JS",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
                      },
                    ],
                  },
                  {
                    category: "Back End",
                    skills: [
                      {
                        name: "Node JS",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
                      },
                    ],
                  },
                  {
                    category: "Database",
                    skills: [
                      {
                        name: "SQL",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
                      },
                      {
                        name: "MongoDB",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
                      },
                      {
                        name: "Supabase",
                        icon: "https://yt3.googleusercontent.com/KVjptxDSWT7rjVfGax2TgTNVAYgplgo1z_fwaV3MFjPpcmNVZC0TIgQV030BPJ0ybCP3_Fz-2w=s900-c-k-c0x00ffffff-no-rj",
                      },
                    ],
                  },
                  {
                    category: "CAD/CAM Tools",
                    skills: [
                      {
                        name: "Auto CAD",
                        icon: "https://5.imimg.com/data5/CJ/JY/RR/SELLER-43556904/item-2356550-943.png",
                      },
                      {
                        name: "Pro-E",
                        icon: "https://5.imimg.com/data5/IOS/Default/2024/2/390547602/PL/NA/JY/49456356/product-jpeg-500x500.png",
                      },
                      {
                        name: "Solid Works",
                        icon: "https://cdn.freebiesupply.com/logos/large/2x/solidworks-logo-svg-vector.svg",
                      },
                    ],
                  },
                  {
                    category: "Design Tools",
                    skills: [
                      {
                        name: "Miro",
                        icon: "https://cdn.brandfetch.io/idAnDTFapY/w/800/h/800/theme/dark/symbol.png?c=1dxbfHSJFAPEGdCLU4o5B",
                      },
                      {
                        name: "Canva",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg",
                      },
                      {
                        name: "Figma",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
                      },
                    ],
                  },
                  {
                    category: "Devops",
                    skills: [
                      {
                        name: "Jenkins",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg",
                      },
                      {
                        name: "Docker",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
                      },
                    ],
                  },
                ].map((category, index) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <SkillCategoryCard category={category.category} skills={category.skills} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Education & Experience Section - Modern Design */}
      <section id="education" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedHeading
            text={
              activeTab === "education" ? "Education" : activeTab === "experience" ? "Work Experience" : "Internships"
            }
          />

          <div className="flex justify-center mb-12">
            <div className="bg-background/50 backdrop-blur-sm p-1 rounded-full inline-flex flex-wrap justify-center">
              <motion.button
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                  activeTab === "education" ? "bg-primary text-white" : "text-muted-foreground"
                } m-1`}
                onClick={() => setActiveTab("education")}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <GraduationCap className="h-4 w-4" />
                <span>Education</span>
              </motion.button>
              <motion.button
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                  activeTab === "experience" ? "bg-primary text-white" : "text-muted-foreground"
                } m-1`}
                onClick={() => setActiveTab("experience")}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Briefcase className="h-4 w-4" />
                <span>Experience</span>
              </motion.button>
              <motion.button
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                  activeTab === "intern" ? "bg-primary text-white" : "text-muted-foreground"
                } m-1`}
                onClick={() => setActiveTab("intern")}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Code className="h-4 w-4" />
                <span>Internships</span>
              </motion.button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === "education" ? (
                <motion.div
                  key="education"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {[
                    {
                      title: "B.Tech - IT",
                      organization: "Kongu Engineering College",
                      period: "2025",
                      description: "6.49 CGPA",
                    },
                    {
                      title: "Diploma - Mechanical",
                      organization: "Sakthi Institute Of Technology",
                      period: "2023",
                      description: "85%",
                    },
                    {
                      title: "HSLC",
                      organization: "SVV Hr. Sec. School",
                      period: "2021",
                      description: "85%",
                    },
                    {
                      title: "SSLC",
                      organization: "Govt Boys Hr. Sec. School",
                      period: "2019",
                      description: "68%",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ModernTimelineCard
                        title={item.title}
                        organization={item.organization}
                        period={item.period}
                        description={item.description}
                        icon={<GraduationCap className="h-5 w-5" />}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : activeTab === "experience" ? (
                <motion.div
                  key="experience"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {[
                    {
                      title: "CNC Operator",
                      organization: "Sakthi Auto Component Limited, Perundurai",
                      period: "2 Month",
                      description: "Full Time",
                    },
                    {
                      title: "Workshop Fitter And Welder",
                      organization: "Sakthi Sugars",
                      period: "15 days",
                      description: "Intern",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ModernTimelineCard
                        title={item.title}
                        organization={item.organization}
                        period={item.period}
                        description={item.description}
                        icon={<Briefcase className="h-5 w-5" />}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="intern"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {[
                    {
                      title: "Web Developer",
                      organization: "InternPe",
                      period: "1 Month",
                      description: "Intern",
                    },
                    {
                      title: "Web Developer",
                      organization: "CodeSoft",
                      period: "1 Month",
                      description: "Intern",
                    },
                    {
                      title: "IOT",
                      organization: "Nxt Gen Instruments",
                      period: "1 Month",
                      description: "Intern",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title + item.organization}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ModernTimelineCard
                        title={item.title}
                        organization={item.organization}
                        period={item.period}
                        description={item.description}
                        icon={<Code className="h-5 w-5" />}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Projects Section - Swipeable Cards */}
      <section id="projects" className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <AnimatedHeading text="Projects" />

            <div
              ref={projectsRef}
              className="relative max-w-4xl mx-auto mt-12 px-4"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="flex justify-between items-center mb-8">
                <Button variant="outline" size="icon" onClick={prevProject} className="z-10">
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <p className="text-center text-sm text-muted-foreground">Swipe or use arrows to navigate projects</p>

                <Button variant="outline" size="icon" onClick={nextProject} className="z-10">
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProject}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                  >
                    <SwipeableProjectCard
                      project={portfolioConfig.projects[currentProject]}
                      index={currentProject + 1}
                      total={portfolioConfig.projects.length}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-center mt-8 gap-2">
                {portfolioConfig.projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProject(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentProject === index ? "bg-primary scale-125" : "bg-muted"
                    }`}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Areas of Interest - Modern Design */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <AnimatedHeading text="Area of Interest" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  title: "Web Development",
                  description:
                    "Creating responsive and interactive web applications using modern frameworks and technologies.",
                  icon: "🌐",
                },
                {
                  title: "Cloud Computing",
                  description:
                    "Leveraging cloud platforms to build scalable and efficient solutions for various applications.",
                  icon: "☁️",
                },
                {
                  title: "Mechanical Engineering Integration with IT",
                  description:
                    "Combining mechanical engineering principles with information technology for innovative solutions.",
                  icon: "⚙️",
                },
              ].map((interest, index) => (
                <motion.div
                  key={interest.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <InterestCard title={interest.title} description={interest.description} icon={interest.icon} />
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <AnimatedHeading text="Contact" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 h-full border-none bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-8 space-y-6">
                    <motion.div
                      className="flex items-center gap-4"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <a
                          href={`tel:${portfolioConfig.phone}`}
                          className="text-lg hover:text-primary transition-colors hover:scale-105 inline-block transition-transform"
                        >
                          {portfolioConfig.phone}
                        </a>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-4"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a
                          href={`mailto:${portfolioConfig.email}`}
                          className="text-lg hover:text-primary transition-colors hover:scale-105 inline-block transition-transform"
                        >
                          {portfolioConfig.email}
                        </a>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-4"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="text-lg hover:scale-105 transition-transform">{portfolioConfig.location}</p>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-4"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Github className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">GitHub</p>
                        <a
                          href={portfolioConfig.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg text-primary hover:underline hover:scale-105 inline-block transition-transform"
                        >
                          GitHub Profile
                        </a>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-4"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Linkedin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">LinkedIn</p>
                        <a
                          href={portfolioConfig.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg text-primary hover:underline hover:scale-105 inline-block transition-transform"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 h-full border-none bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold mb-6">Send a Message</h3>
                    <form className="space-y-6">
                      <div>
                        <label htmlFor="name" className="text-sm text-muted-foreground block mb-2">
                          Your Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          className="w-full p-3 rounded-lg border bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="text-sm text-muted-foreground block mb-2">
                          Your Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          className="w-full p-3 rounded-lg border bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="text-sm text-muted-foreground block mb-2">
                          Your Message
                        </label>
                        <textarea
                          id="message"
                          placeholder="Hello, I'd like to talk about..."
                          rows={4}
                          className="w-full p-3 rounded-lg border bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-300"
                        ></textarea>
                      </div>
                      <Button className="w-full relative overflow-hidden group py-6 text-lg">
                        <div className="absolute inset-0 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        <span className="relative z-10">Send Message</span>
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t mb-16 md:mb-0">
        <div className="container mx-auto px-4 text-center">
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            © {new Date().getFullYear()} {portfolioConfig.name}. All rights reserved.
          </motion.p>
        </div>
      </footer>
    </motion.main>
  )
}

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedHeading({ text }: { text: string }) {
  const words = text.split(" ")

  return (
    <h2 className="text-4xl font-bold mb-12 text-center">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.1, color: "hsl(var(--primary))" }}
        >
          {word}
        </motion.span>
      ))}
    </h2>
  )
}

function SkillCategoryCard({ category, skills }: { category: string; skills: { name: string; icon: string }[] }) {
  return (
    <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.3 }} className="h-full">
      <Card className="h-full overflow-hidden border-none bg-background/80 backdrop-blur-sm shadow-lg">
        <div className="h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
        <CardContent className="p-6">
          <motion.h3
            className="text-xl font-semibold mb-4 pb-2 border-b border-primary/20"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {category}
          </motion.h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <motion.div
                  className="w-12 h-12 mb-2 flex items-center justify-center"
                  whileHover={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <img src={skill.icon || "/placeholder.svg"} alt={skill.name} className="max-w-full max-h-full" />
                </motion.div>
                <p className="text-sm text-center">{skill.name}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ModernTimelineCard({
  title,
  organization,
  period,
  description,
  icon,
}: {
  title: string
  organization: string
  period: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.3 }} className="relative">
      <Card className="overflow-hidden border-none bg-background/80 backdrop-blur-sm shadow-lg">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">{icon}</div>
            <div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-muted-foreground">{organization}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-primary/10 text-primary-foreground border-none">
                  {period}
                </Badge>
                <Badge variant="outline" className="bg-muted/50 border-none">
                  {description}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function InterestCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <motion.div whileHover={{ y: -10, scale: 1.03 }} transition={{ duration: 0.3 }} className="h-full">
      <Card className="h-full overflow-hidden border-none bg-background/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <motion.div
            className="text-4xl mb-4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            viewport={{ once: true }}
          >
            {icon}
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function SwipeableProjectCard({
  project,
  index,
  total,
}: {
  project: { title: string; description: string; link: string }
  index: number
  total: number
}) {
  return (
    <motion.div className="w-full" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden border-none bg-background/80 backdrop-blur-sm shadow-lg">
        <div className="h-2 bg-primary" />
        <div className="relative">
          <div className="absolute top-4 right-4 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full">
            {index} / {total}
          </div>
          <div className="h-48 bg-gradient-to-r from-primary/5 to-primary/20 flex items-center justify-center p-4">
            <h3 className="text-3xl font-bold text-center px-4 hover:scale-105 transition-transform duration-300">
              {project.title}
            </h3>
          </div>
        </div>
        <CardContent className="p-6">
          <p className="text-muted-foreground mb-6 hover:text-foreground transition-colors duration-300">
            {project.description}
          </p>
          <Button
            variant="outline"
            className="w-full relative overflow-hidden group py-6"
            onClick={() => window.open(project.link, "_blank")}
          >
            <div className="absolute inset-0 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            <span className="relative z-10 flex items-center justify-center text-lg">
              View Project
              <ExternalLink className="ml-2 h-4 w-4" />
            </span>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function TypingAnimation({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState("")

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [text])

  return (
    <h2 className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </h2>
  )
}
