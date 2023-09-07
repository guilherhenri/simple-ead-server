import { ClassModule, Prisma } from '@prisma/client'

export interface ClassModulesRepository {
  findById(id: string): Promise<ClassModule | null>
  findByTitleAndCourseId(
    title: string,
    courseId: string,
  ): Promise<ClassModule | null>
  findByCourseId(courseId: string): Promise<ClassModule[]>
  create(data: Prisma.ClassModuleUncheckedCreateInput): Promise<ClassModule>
}
