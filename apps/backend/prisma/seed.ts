import { PrismaClient, Role, TransactionType, ContentType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash: 'dev-hash',
      role: Role.ADMIN,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      name: 'Student',
      email: 'student@example.com',
      passwordHash: 'dev-hash',
      role: Role.STUDENT,
    },
  });

  await prisma.transaction.createMany({
    data: [
      { userId: student.id, type: TransactionType.INCOME, amount: 200000, category: 'Salary', date: new Date() },
      { userId: student.id, type: TransactionType.EXPENSE, amount: 50000, category: 'Food', date: new Date() },
    ],
  });

  await prisma.goal.create({
    data: { userId: student.id, targetAmount: 500000, savedAmount: 100000, deadline: new Date(Date.now() + 86400*30*1000) },
  });

  const course = await prisma.course.create({
    data: {
      title: 'Personal Finance 101',
      description: 'Basics of budgeting and saving',
      instructorId: admin.id,
      published: true,
      videoRefs: [],
    },
  });

  const lesson = await prisma.lesson.create({
    data: {
      title: 'Budgeting Basics',
      contentType: ContentType.TEXT,
      contentRef: 'https://example.com/budgeting-basics',
    },
  });

  await prisma.progress.create({
    data: { userId: student.id, courseId: course.id, lessonId: lesson.id, percentComplete: 25 },
  });

  // eslint-disable-next-line no-console
  console.log('Seed completed');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

