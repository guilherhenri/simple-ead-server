import { CoursesRepository } from '@/repositories/courses-repository'
import { generateSlug } from '@/utils/generate-slug'
import { Course, Prisma } from '@prisma/client'

export async function makeCourse(
  override: Partial<Prisma.CourseUncheckedCreateInput> = {},
  coursesRepository: CoursesRepository,
): Promise<Course> {
  const course = coursesRepository.create({
    title: 'Course example',
    description: 'description example',
    slug: generateSlug(override?.title ?? 'Course example'),
    access_time: 30,
    producer_id: 'producer-id',
    ...override,
  })

  return course
}
