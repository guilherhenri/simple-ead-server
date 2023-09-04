import { CoursesRepository } from '@/repositories/courses-repository'
import { generateSlug } from '@/utils/generate-slug'
import { Course, Prisma } from '@prisma/client'

export async function makeCourse(
  override: Partial<Prisma.CourseUncheckedCreateInput> = {},
  coursesRepository: CoursesRepository,
  productorId: string,
): Promise<Course> {
  const course = coursesRepository.create({
    title: 'Course example',
    description: 'description example',
    slug: generateSlug(override?.title ?? 'Course example'),
    access_time: 30,
    productor_id: productorId,
    ...override,
  })

  return course
}
