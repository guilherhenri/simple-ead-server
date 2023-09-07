import { ClassModulesRepository } from '@/repositories/class-modules-repository'
import { ClassModule, Prisma } from '@prisma/client'

export async function makeClassModule(
  override: Partial<Prisma.ClassModuleUncheckedCreateInput> = {},
  classModulesRepository: ClassModulesRepository,
): Promise<ClassModule> {
  const classModule = await classModulesRepository.create({
    title: 'module example',
    description: 'module description',
    order: 1,
    course_id: 'course-id',
    ...override,
  })

  return classModule
}
