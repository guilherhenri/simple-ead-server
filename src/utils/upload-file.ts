import { MultipartFile } from '@fastify/multipart'
import fs from 'node:fs'
import util from 'node:util'
import { pipeline } from 'node:stream'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { Either, left, right } from '@/core/either'

type UploadFileResponse = Either<
  null,
  {
    filename: string
  }
>

export async function uploadFile(
  part: MultipartFile,
  foldername: string,
): Promise<UploadFileResponse> {
  try {
    if (!fs.existsSync('./tmp')) {
      fs.mkdirSync('tmp')
    }

    if (!fs.existsSync(`./tmp/${foldername}`)) {
      fs.mkdirSync(`./tmp/${foldername}`)
    }

    const extension = path.extname(part.filename)
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
