import { ClassModule, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { ClassModulesRepository } from '@/repositories/class-modules-repository'

export class InMemoryClassModulesRepository implements ClassModulesRepository {
  public classModules: ClassModule[] = []

  async findByTitle(title: string) {
    const classModule = this.classModules.find((item) => item.title === title)

    if (!classModule) {
      return null
    }

    return classModule
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
