import fs from 'node:fs'

import { uploadFile } from './upload-file'

describe('Upload File', () => {
  beforeEach(() => {
    const content = 'Test'
    fs.writeFileSync('test.txt', content)
  })

  afterEach(() => {
    fs.unlinkSync('test.txt')
    fs.rmdirSync('tmp/test')
  })

  it('should be able to upload a file', async () => {
    const file = fs.readFileSync('test.txt').toString()

    const result = await uploadFile(
      {
        file,
        filename: 'test.txt',
      },
      'test',
    )

    expect(result.isRight()).toBeTruthy()
    expect(fs.existsSync(`tmp/test/${result.value?.filename}`)).toBeTruthy()

    fs.unlinkSync(`tmp/test/${result.value?.filename}`)
  })
})
