import { Class, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { ClassesRepository } from '@/repositories/classes-repository'

export class InMemoryClassesRepository implements ClassesRepository {
  public classes: Class[] = []

  async findBySlug(slug: string) {
    const lesson = this.classes.find((item) => item.slug === slug)

    if (!lesson) {
      return null
    }

    return lesson
  }

  async findByTitleAndClassModuleId(title: string, classModuleId: string) {
    const lesson = this.classes.find(
      (item) => item.title === title && item.class_module_id === classModuleId,
    )

    if (!lesson) {
      return null
    }

    return lesson
  }

  async create(data: Prisma.ClassUncheckedCreateInput) {
    const lesson = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      slug: data.slug,
      video_embed: data.video_embed,
      class_module_id: data.class_module_id,
    }

    this.classes.push(lesson)

    return lesson
  }
}
