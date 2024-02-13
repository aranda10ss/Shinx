import { promises as fsPromises } from 'fs'
import { join } from 'path'
const { readdir, stat } = fsPromises

export async function findJSFiles (dir) {
  const JSFiles = []

  async function searchRecursively (currentDir) {
    try {
      const files = await readdir(currentDir)

      for (const file of files) {
        const filePath = join(currentDir, file)
        const stats = await stat(filePath)

        if (stats.isDirectory()) {
          await searchRecursively(filePath)
        } else if (stats.isFile() && filePath.endsWith('.js')) {
          JSFiles.push(filePath)
        }
      }
    } catch { }
  }
  await searchRecursively(dir)
  return JSFiles
}
