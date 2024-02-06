import fs from 'fs'
import path from 'path'

const getFiles = (dir, folderOnly = false) => {
  const files = fs.readdirSync(dir, {
    withFileTypes: true,
  })

  let foundFiles = []

  for (const file of files) {
    const fileName = path.join(dir, file.name)

    if (file.isDirectory()) {
      if (folderOnly) {
        foundFiles.push(fileName)
      } else {
        foundFiles = foundFiles.concat(getFiles(fileName))
      }
      continue
    }

    if (!folderOnly) {
      foundFiles.push(fileName)
    }
  }

  return foundFiles
}

export default getFiles
