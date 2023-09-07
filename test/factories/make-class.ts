import { ClassesRepository } from '@/repositories/classes-repository'
import { generateSlug } from '@/utils/generate-slug'
import { Class, Prisma } from '@prisma/client'

export async function makeClass(
  override: Partial<Prisma.ClassUncheckedCreateInput> = {},
  classesRepository: ClassesRepository,
): Promise<Class> {
  const lesson = await classesRepository.create({
    title: 'module example',
    description: 'module description',
    class_module_id: 'class-module-id',
    slug: generateSlug(override?.title ?? 'module-example'),
    video_embed: '',
    ...override,
  })

  return lesson
}
