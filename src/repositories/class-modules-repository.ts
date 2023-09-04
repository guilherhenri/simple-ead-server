import { ClassModule, Prisma } from '@prisma/client'

export interface ClassModulesRepository {
  findByTitle(title: string): Promise<ClassModule | null>
  create(data: Prisma.ClassModuleUncheckedCreateInput): Promise<ClassModule>
}
