import fastify from 'fastify'
import multipart from '@fastify/multipart'

export const app = fastify()

app.register(multipart)
