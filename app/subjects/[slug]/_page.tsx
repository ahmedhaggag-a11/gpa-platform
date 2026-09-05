"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Star, Users, Clock, Play, GraduationCap, Award } from "lucide-react"
import Link from "next/link"

export default function SubjectDetailPage({ params }: { params: { slug: string } }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterGrade, setFilterGrade] = useState("all")
  const [filterCountry, setFilterCountry] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  // Mock subject data - in real app, fetch based on params.slug
  const subject = {
    id: params.slug,
    name: "Mathematics",
    description:
      "Master mathematical concepts from basic algebra to advanced calculus, statistics, and beyond. Our comprehensive mathematics curriculum covers all essential topics for academic success.",
    icon: "📊",
    totalCourses: 120,
    totalStudents: 8500,
    averageRating: 4.8,
    totalTeachers: 15,
    grades: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
    countries: ["🇪🇬 Egypt", "🇸🇦 Saudi Arabia", "🇦🇪 UAE"],
    topics: [
      "Algebra",
      "Calculus",
      "Geometry",
      "Statistics",
      "Trigonometry",
      "Linear Algebra",
      "Differential Equations",
      "Probability",
      "Number Theory",
    ],
    learningOutcomes: [
      "Develop strong problem-solving skills",
      "Master mathematical reasoning and proof techniques",
      "Apply mathematics to real-world situations",
      "Prepare for advanced mathematics courses",
      "Build confidence in mathematical thinking",
    ],
  }

  const courses = [
    {
      id: 1,
      title: "Advanced Calculus",
      grade: "Grade 12",
      country: "🇪🇬 Egypt",
      teacher: "Dr. Ahmed Hassan",
      rating: 4.9,
      students: 1250,
      duration: "24 hours",
      price: "$49",
      level: "Advanced",
      topics: ["Limits", "Derivatives", "Integrals", "Applications"],
      thumbnail: "/calculus-math-education.jpg",
    },
    {
      id: 2,
      title: "Linear Algebra Fundamentals",
      grade: "Grade 11",
      country: "🇸🇦 Saudi Arabia",
      teacher: "Prof. Sarah Al-Rashid",
      rating: 4.8,
      students: 890,
      duration: "20 hours",
      price: "$42",
      level: "Intermediate",
      topics: ["Vectors", "Matrices", "Systems", "Eigenvalues"],
      thumbnail: "/placeholder.svg?key=linear",
    },
    {
      id: 3,
      title: "Statistics & Probability",
      grade: "Grade 12",
      country: "🇦🇪 UAE",
      teacher: "Dr. Omar Al-Mansouri",
      rating: 4.9,
      students: 650,
      duration: "18 hours",
      price: "$39",
      level: "Intermediate",
      topics: ["Descriptive Statistics", "Probability", "Distributions", "Inference"],
      thumbnail: "/placeholder.svg?key=stats",
    },
    {
      id: 4,
      title: "Algebra Mastery",
      grade: "Grade 10",
      country: "🇪🇬 Egypt",
      teacher: "Ms. Fatima Al-Zahra",
      rating: 4.7,
      students: 1100,
      duration: "16 hours",
      price: "$35",
      level: "Beginner",
      topics: ["Equations", "Functions", "Polynomials", "Inequalities"],
      thumbnail: "/placeholder.svg?key=algebra",
    },
    {
      id: 5,
      title: "Geometry Essentials",
      grade: "Grade 9",
      country: "🇸🇦 Saudi Arabia",
      teacher: "Dr. Khalid Al-Rashid",
      rating: 4.6,
      students: 980,
      duration: "14 hours",
      price: "$32",
      level: "Beginner",
      topics: ["Shapes", "Angles", "Area", "Volume"],
      thumbnail: "/placeholder.svg?key=geometry",
    },
    {
      id: 6,
      title: "Trigonometry Complete",
      grade: "Grade 11",
      country: "🇦🇪 UAE",
      teacher: "Prof. Layla Al-Mahmoud",
      rating: 4.8,
      students: 750,
      duration: "15 hours",
      price: "$38",
      level: "Intermediate",
      topics: ["Ratios", "Identities", "Graphs", "Applications"],
      thumbnail: "/placeholder.svg?key=trig",
    },
  ]

  const teachers = [
    {
      id: 1,
      name: "Dr. Ahmed Hassan",
      title: "Mathematics Professor",
      university: "Cairo University",
      rating: 4.9,
      students: 2500,
      courses: 8,
      specialization: "Calculus & Analysis",
    },
    {
      id: 2,
      name: "Prof. Sarah Al-Rashid",
      title: "Mathematics Professor",
      university: "King Saud University",
      rating: 4.8,
      students: 1800,
      courses: 6,
      specialization: "Linear Algebra",
    },
    {
      id: 3,
      name: "Dr. Omar Al-Mansouri",
      title: "Statistics Professor",
      university: "UAE University",
      rating: 4.9,
      students: 1200,
      courses: 5,
      specialization: "Statistics & Probability",
    },
  ]

  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesGrade = filterGrade === "all" || course.grade === filterGrade
      const matchesCountry = filterCountry === "all" || course.country.includes(filterCountry)

      return matchesSearch && matchesGrade && matchesCountry
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "students":
          return b.students - a.students
        case "price-low":
          return Number.parseInt(a.price.replace("$", "")) - Number.parseInt(b.price.replace("$", ""))
        case "price-high":
          return Number.parseInt(b.price.replace("$", "")) - Number.parseInt(a.price.replace("$", ""))
        default: // popular
          return b.students - a.students
      }
    })

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        {" / "}
        <Link href="/subjects" className="hover:text-primary">
          Subjects
        </Link>
        {" / "}
        <span>{subject.name}</span>
      </nav>

      {/* Subject Header */}
      <Card className="mb-8 animate-slide-up">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{subject.icon}</div>
            <h1 className="text-4xl font-bold mb-4">{subject.name}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">{subject.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{subject.totalCourses}</div>
              <div className="text-sm text-muted-foreground">Courses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{subject.totalStudents.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{subject.totalTeachers}</div>
              <div className="text-sm text-muted-foreground">Teachers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{subject.averageRating}</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="courses" className="animate-slide-up">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">Courses ({subject.totalCourses})</TabsTrigger>
          <TabsTrigger value="teachers">Teachers ({subject.totalTeachers})</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-6">
          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterGrade} onValueChange={setFilterGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {subject.grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterCountry} onValueChange={setFilterCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="Egypt">🇪🇬 Egypt</SelectItem>
                    <SelectItem value="Saudi">🇸🇦 Saudi Arabia</SelectItem>
                    <SelectItem value="UAE">🇦🇪 UAE</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">{subject.name} Courses</h2>
              <p className="text-muted-foreground">{filteredCourses.length} courses found</p>
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <Card
                key={course.id}
                className="hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary" className="hover-lift">
                      <Play className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{course.country}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {course.rating}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>
                    {course.grade} • {course.level}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage
                          src={`/ceholder-svg-key-teach.jpg?key=teach${course.id}&height=24&width=24&query=${course.teacher}+teacher`}
                        />
                        <AvatarFallback>
                          {course.teacher
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {course.teacher}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {course.topics.slice(0, 3).map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {course.topics.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{course.topics.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        {course.students} students
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-2xl font-bold text-primary">{course.price}</span>
                      <Button size="sm" className="hover-lift" asChild>
                        <Link href={`/course/${course.id}`}>View Course</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teachers" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher, index) => (
              <Card
                key={teacher.id}
                className="hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-4">
                    <AvatarImage
                      src={`/ceholder-svg-key-prof.jpg?key=prof${teacher.id}&height=64&width=64&query=${teacher.name}+professor`}
                    />
                    <AvatarFallback className="text-lg">
                      {teacher.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold mb-1">{teacher.name}</h3>
                  <p className="text-sm text-primary mb-2">{teacher.title}</p>
                  <p className="text-xs text-muted-foreground mb-3">{teacher.university}</p>
                  <Badge variant="outline" className="mb-4">
                    {teacher.specialization}
                  </Badge>

                  <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                    <div>
                      <div className="font-semibold text-primary">{teacher.rating}</div>
                      <div className="text-muted-foreground">Rating</div>
                    </div>
                    <div>
                      <div className="font-semibold text-primary">{teacher.students}</div>
                      <div className="text-muted-foreground">Students</div>
                    </div>
                    <div>
                      <div className="font-semibold text-primary">{teacher.courses}</div>
                      <div className="text-muted-foreground">Courses</div>
                    </div>
                  </div>

                  <Button size="sm" className="w-full hover-lift" asChild>
                    <Link href={`/teachers/${teacher.id}`}>View Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Outcomes</CardTitle>
                <CardDescription>What you'll achieve by studying {subject.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {subject.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start">
                      <Award className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Topics Covered</CardTitle>
                <CardDescription>Key areas of study in {subject.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {subject.topics.map((topic) => (
                    <Badge key={topic} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grade Levels</CardTitle>
                <CardDescription>Available for these grade levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {subject.grades.map((grade) => (
                    <div key={grade} className="flex items-center p-2 border rounded">
                      <GraduationCap className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">{grade}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Countries</CardTitle>
                <CardDescription>Curriculum support for these regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {subject.countries.map((country) => (
                    <div key={country} className="flex items-center p-2 border rounded">
                      <span className="text-sm">{country}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
