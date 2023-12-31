import { Prisma, Course } from '@prisma/client'

export interface CoursesRepository {
  findById(id: string): Promise<Course | null>
  findByTitle(title: string): Promise<Course | null>
  findBySlug(slug: string): Promise<Course | null>
  create(data: Prisma.CourseUncheckedCreateInput): Promise<Course>
}
