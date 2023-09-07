import { Role } from '@prisma/client'
import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'

import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { EmailAlreadyInUseError } from '@/use-cases/errors/email-already-in-use-error'
import { cpfValidation } from '@/utils/cpf-validation'
import { UnauthorizedExceptionError } from '@/http/errors/unauthorized-excepction-error'
import { DefaultError } from '@/http/errors/default-error'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    cpf: z
      .string()
      .refine((val) => cpfValidation(val))
      .optional(),
    role: z.nativeEnum(Role),
  })

  const { name, email, password, cpf, role } = registerBodySchema.parse(
    request.body,
  )

  const registerUseCase = makeRegisterUseCase()

  const result = await registerUseCase.execute({
    name,
    email,
    password,
    cpf,
    role,
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case EmailAlreadyInUseError:
        throw new UnauthorizedExceptionError(error)

      default:
        throw new DefaultError(error)
    }
  }

  return reply.status(201).send()
}
