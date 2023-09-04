import { Class, Prisma } from '@prisma/client'

export interface ClassesRepository {
  findById(id: string): Promise<Class | null>
  findByTitleAndClassModuleId(
    title: string,
    classModuleId: string,
  ): Promise<Class | null>
  findBySlug(slug: string): Promise<Class | null>
  create(data: Prisma.ClassUncheckedCreateInput): Promise<Class>
}
