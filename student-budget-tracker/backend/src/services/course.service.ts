import prisma from '@/config/database';
import { Course, Lesson, Progress } from '@prisma/client';

export class CourseService {
  async createCourse(
    instructorId: string,
    title: string,
    description: string,
    price?: number,
    thumbnail?: string
  ): Promise<Course> {
    const priceInCents = price ? Math.round(price * 100) : null;

    return prisma.course.create({
      data: {
        title,
        description,
        instructorId,
        price: priceInCents,
        thumbnail,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        lessons: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
  }

  async getCourses(published?: boolean) {
    const where: any = {};
    if (published !== undefined) {
      where.published = published;
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        lessons: {
          select: {
            id: true,
            title: true,
            orderIndex: true,
            duration: true,
          },
          orderBy: { orderIndex: 'asc' }
        },
        _count: {
          select: {
            progress: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return courses.map(course => ({
      ...course,
      price: course.price ? course.price / 100 : null,
      enrollmentCount: course._count.progress
    }));
  }

  async getCourseById(courseId: string, userId?: string) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        lessons: {
          orderBy: { orderIndex: 'asc' }
        },
        progress: userId ? {
          where: { userId }
        } : false
      }
    });

    if (!course) {
      return null;
    }

    return {
      ...course,
      price: course.price ? course.price / 100 : null,
      userProgress: userId && course.progress ? course.progress : null
    };
  }

  async updateCourse(
    courseId: string,
    instructorId: string,
    updates: Partial<{
      title: string;
      description: string;
      price: number;
      published: boolean;
      thumbnail: string;
    }>
  ): Promise<Course | null> {
    // Check if course belongs to instructor
    const existingCourse = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId
      }
    });

    if (!existingCourse) {
      return null;
    }

    const updateData = { ...updates };
    if (updates.price !== undefined) {
      updateData.price = updates.price ? Math.round(updates.price * 100) : null;
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: updateData,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        lessons: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    return {
      ...updatedCourse,
      price: updatedCourse.price ? updatedCourse.price / 100 : null
    };
  }

  async deleteCourse(courseId: string, instructorId: string): Promise<boolean> {
    try {
      await prisma.course.deleteMany({
        where: {
          id: courseId,
          instructorId
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async enrollInCourse(userId: string, courseId: string): Promise<Progress> {
    // Check if already enrolled
    const existingProgress = await prisma.progress.findFirst({
      where: {
        userId,
        courseId,
        lessonId: null // Course-level progress
      }
    });

    if (existingProgress) {
      return existingProgress;
    }

    return prisma.progress.create({
      data: {
        userId,
        courseId,
        percentComplete: 0
      }
    });
  }

  async getUserCourses(userId: string) {
    const enrollments = await prisma.progress.findMany({
      where: {
        userId,
        lessonId: null // Course-level progress only
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            },
            lessons: {
              select: {
                id: true,
                title: true,
                orderIndex: true,
              },
              orderBy: { orderIndex: 'asc' }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return enrollments.map(enrollment => ({
      ...enrollment.course,
      price: enrollment.course.price ? enrollment.course.price / 100 : null,
      progress: enrollment.percentComplete,
      enrolledAt: enrollment.createdAt
    }));
  }
}