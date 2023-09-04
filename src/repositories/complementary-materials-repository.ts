import { ComplementaryMaterial, Prisma } from '@prisma/client'

export interface ComplementaryMaterialsRepository {
  create(
    data: Prisma.ComplementaryMaterialUncheckedCreateInput,
  ): Promise<ComplementaryMaterial>
}
