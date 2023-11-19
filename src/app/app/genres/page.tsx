import { prisma } from '../../../server/prisma'

async function generateGenres() {
  if (await checkIfGenresExist()) {
    console.log('Genres already exist')
    return
  }

  await createGenreTree(100)
}

async function checkIfGenresExist() {
  const numGenres = await prisma.genre.count()
  return numGenres > 0
}

async function createGenreTree(size: number) {
  if (size < 1) {
    console.log('Size should be at least 1')
    return
  }

  // Generate genres with unique names
  const genres = []
  for (let i = 1; i <= size; i++) {
    genres.push(`Genre${i}`)
  }

  // Insert the root genre
  await insertGenre(genres[0], [])

  // Define parent-child relationships and insert them
  for (let i = 1; i < genres.length; i++) {
    // Define multiple parents for each genre
    let parents = []

    // Randomly select a number of parents (between 1 and a maximum)
    const numParents = Math.min(i, Math.floor(Math.random() * 3) + 1)

    for (let j = 0; j < numParents; j++) {
      // Randomly select a parent from the previously created genres
      const parentIndex = Math.floor(Math.random() * i)
      parents.push(parentIndex + 1) // Database IDs are 1-indexed
    }

    // Ensure unique parents for each genre
    parents = [...new Set(parents)]

    await insertGenre(genres[i], parents)
  }
}

const insertGenre = async (name: string, parents: number[]) => {
  await prisma.genre.create({
    data: {
      name,
      parentGenres: {
        connect: parents.map((parentId) => ({ id: parentId })),
      },
    },
  })
}

async function getTreeGenres() {
  await generateGenres()
  return prisma.genre.findMany({
    select: { id: true, name: true, parentGenres: { select: { id: true } } },
  })
}

export default async function Page() {
  const treeGenres = await getTreeGenres()

  return (
    <ul>
      {treeGenres.map((genre) => (
        <li key={genre.id}>{genre.name}</li>
      ))}
    </ul>
  )
}
