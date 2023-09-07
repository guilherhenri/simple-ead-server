import 'dotenv/config'
import fastify from 'fastify'
import multipart from '@fastify/multipart'
import { ZodError } from 'zod'
import { STATUS_CODES as statusCodes } from 'node:http'

import { env } from './env'
import { ControllerError } from './core/errors/controller-error'
import routes from './http/routes'

export const app = fastify()

app.register(multipart)

routes.map((route) => app.register(route))

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format(),
    })
  }

  if (error instanceof ControllerError) {
    return reply.status(error.statusCode || 500).send({
      error: statusCodes[error.statusCode || 500],
      message: error.message,
      statusCode: error.statusCode || 500,
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
