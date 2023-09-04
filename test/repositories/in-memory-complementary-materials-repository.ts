import { ComplementaryMaterialsRepository } from '@/repositories/complementary-materials-repository'
import { ComplementaryMaterial, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

export class InMemoryComplementaryMaterialsRepository
  implements ComplementaryMaterialsRepository
{
  public materials: ComplementaryMaterial[] = []

  async create(data: Prisma.ComplementaryMaterialUncheckedCreateInput) {
    const material = {
      id: randomUUID(),
      filename: data.filename,
      class_id: data.class_id,
    }

    this.materials.push(material)

    return material
  }
}
