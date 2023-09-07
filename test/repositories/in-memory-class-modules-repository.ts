import { ClassModule, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { ClassModulesRepository } from '@/repositories/class-modules-repository'

export class InMemoryClassModulesRepository implements ClassModulesRepository {
  public classModules: ClassModule[] = []

  async findById(id: string) {
    const classModule = this.classModules.find((item) => item.id === id)

    if (!classModule) {
      return null
    }

    return classModule
  }

  async findByTitleAndCourseId(title: string, courseId: string) {
    const classModule = this.classModules.find(
      (item) => item.title === title && item.course_id === courseId,
    )

    if (!classModule) {
      return null
    }

    return classModule
  }

  async findByCourseId(courseId: string) {
    const classModules = this.classModules
      .filter((item) => item.course_id === courseId)
      .sort((a, b) => {
        if (a.order < b.order) {
          return -1
        }

        if (a.order > b.order) {
          return 1
        }

        return 0
      })

    return classModules
  }

  async create(data: Prisma.ClassModuleUncheckedCreateInput) {
    const classModule = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      order: data.order,
      course_id: data.course_id,
    }

    this.classModules.push(classModule)

    return classModule
  }
}
