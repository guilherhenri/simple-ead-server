import fs from 'node:fs'
import util from 'node:util'
import path from 'node:path'
import { pipeline } from 'node:stream'
import { randomUUID } from 'node:crypto'

import { Either, left, right } from '@/core/either'
import { MultipartFile } from '@fastify/multipart'

type UploadFileResponse = Either<
  null,
  {
    filename: string
  }
>

export interface File {
  file: any // eslint-disable-line
  filename: string
}

export async function uploadFile(
  part: MultipartFile | File,
  foldername: string,
): Promise<UploadFileResponse> {
  try {
    if (!fs.existsSync('./tmp')) {
      fs.mkdirSync('tmp')
    }

    if (!fs.existsSync(`./tmp/${foldername}`)) {
      fs.mkdirSync(`./tmp/${foldername}`)
    }

    const extension = path.extname(part.filename).split('.').join('')
    const filename = `${randomUUID()}.${extension}`
    const pump = util.promisify(pipeline)

    await pump(
      part.file,
      fs.createWriteStream(`./tmp/${foldername}/${filename}`),
    )

    return right({
      filename,
    })
  } catch {
    return left(null)
  }
}
