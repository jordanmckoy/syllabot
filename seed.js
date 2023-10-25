// Import necessary Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client');

// Instantiate the Prisma Client
const prisma = new PrismaClient();

// Define the Course data to be seeded
const courseData = [
    {
        name: 'Course 1',
        description: 'Description for Course 1',
        image: 'https://random.imagecdn.app/500/150',
    },
    {
        name: 'Course 2',
        description: 'Description for Course 2',
        image: 'https://random.imagecdn.app/500/150',
    },
    {
        name: 'Course 3',
        description: 'Description for Course 1',
        image: 'https://random.imagecdn.app/500/150',
    },
    {
        name: 'Course 4',
        description: 'Description for Course 2',
        image: 'https://random.imagecdn.app/500/150',
    },
    {
        name: 'Course 5',
        description: 'Description for Course 1',
        image: 'https://random.imagecdn.app/500/150',
    },
    {
        name: 'Course 6',
        description: 'Description for Course 2',
        image: 'https://random.imagecdn.app/500/150',
    },
    {
        name: 'Course 7',
        description: 'Description for Course 1',
        image: 'https://random.imagecdn.app/500/150',
    },
    {
        name: 'Course 8',
        description: 'Description for Course 2',
        image: 'https://random.imagecdn.app/500/150',
    },
    // Add more courses as needed
];

async function main() {
    for (const data of courseData) {
        await prisma.course.create({
            data,
        });
    }
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
