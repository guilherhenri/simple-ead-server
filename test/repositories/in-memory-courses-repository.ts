import { Course, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

import { CoursesRepository } from '@/repositories/courses-repository'

export class InMemoryCoursesRepository implements CoursesRepository {
  public courses: Course[] = []

  async findByTitle(title: string) {
    const course = this.courses.find((course) => course.title === title)

    if (!course) {
      return null
    }

    return course
  }

  async findBySlug(slug: string) {
    const course = this.courses.find((course) => course.slug === slug)

    if (!course) {
      return null
    }

    return course
  }

  async create(data: Prisma.CourseUncheckedCreateInput) {
    const subjects: string[] = []

    if (Array.isArray(data.subjects)) {
      for (let i = 0; i < data.subjects.length; i++) {
        subjects.push(data.subjects[i])
      }
    }

    const course = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      slug: data.slug,
      access_time: data.access_time,
      banner_filename: data.banner_filename,
      subjects,
      productor_id: data.productor_id,
    }

    this.courses.push(course)

    return course
  }
}
