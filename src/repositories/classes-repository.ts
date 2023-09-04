import { Class, Prisma } from '@prisma/client'

export interface ClassesRepository {
  findByTitleAndClassModuleId(
    title: string,
    classModuleId: string,
  ): Promise<Class | null>
  findBySlug(slug: string): Promise<Class | null>
  create(data: Prisma.ClassUncheckedCreateInput): Promise<Class>
}
