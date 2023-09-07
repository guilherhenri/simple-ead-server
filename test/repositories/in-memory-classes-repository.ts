import { Class, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { ClassesRepository } from '@/repositories/classes-repository'

export class InMemoryClassesRepository implements ClassesRepository {
  public classes: Class[] = []

  async findById(id: string) {
    const lesson = this.classes.find((item) => item.id === id)

    if (!lesson) {
      return null
    }

    return lesson
  }

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

  async fetchManyByClassModuleId(classModuleId: string) {
    const classes = this.classes
      .filter((item) => item.class_module_id === classModuleId)
      .sort((a, b) => {
        if (a.order < b.order) {
          return -1
        }

        if (a.order > b.order) {
          return 1
        }

        return 0
      })

    return classes
  }

  async create(data: Prisma.ClassUncheckedCreateInput) {
    const lesson = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      slug: data.slug,
      video_embed: data.video_embed,
      class_module_id: data.class_module_id,
      order: data.order,
    }

    this.classes.push(lesson)

    return lesson
  }
}
