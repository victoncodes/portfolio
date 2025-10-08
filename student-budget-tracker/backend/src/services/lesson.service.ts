import prisma from '@/config/database';
import { Lesson, Progress, ContentType } from '@prisma/client';

export class LessonService {
  async createLesson(
    courseId: string,
    instructorId: string,
    title: string,
    contentType: ContentType,
    contentRef: string,
    orderIndex: number,
    duration?: number,
    unlockCondition?: any
  ): Promise<Lesson | null> {
    // Verify instructor owns the course
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId
      }
    });

    if (!course) {
      return null;
    }

    return prisma.lesson.create({
      data: {
        courseId,
        title,
        contentType,
        contentRef,
        orderIndex,
        duration,
        unlockCondition
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    });
  }

  async getLessons(courseId: string, userId?: string) {
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      include: {
        progress: userId ? {
          where: { userId }
        } : false
      },
      orderBy: { orderIndex: 'asc' }
    });

    return lessons.map(lesson => ({
      ...lesson,
      userProgress: userId && lesson.progress.length > 0 ? lesson.progress[0] : null,
      progress: undefined // Remove the progress array from response
    }));
  }

  async getLessonById(lessonId: string, userId?: string): Promise<Lesson | null> {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true,
          }
        },
        progress: userId ? {
          where: { userId }
        } : false
      }
    });

    if (!lesson) {
      return null;
    }

    return {
      ...lesson,
      userProgress: userId && lesson.progress.length > 0 ? lesson.progress[0] : null,
      progress: undefined // Remove the progress array from response
    };
  }

  async updateLesson(
    lessonId: string,
    instructorId: string,
    updates: Partial<{
      title: string;
      contentType: ContentType;
      contentRef: string;
      orderIndex: number;
      duration: number;
      unlockCondition: any;
    }>
  ): Promise<Lesson | null> {
    // Verify instructor owns the course that contains this lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: true
      }
    });

    if (!lesson || lesson.course.instructorId !== instructorId) {
      return null;
    }

    return prisma.lesson.update({
      where: { id: lessonId },
      data: updates,
      include: {
        course: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    });
  }

  async deleteLesson(lessonId: string, instructorId: string): Promise<boolean> {
    try {
      // Verify instructor owns the course that contains this lesson
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          course: true
        }
      });

      if (!lesson || lesson.course.instructorId !== instructorId) {
        return false;
      }

      await prisma.lesson.delete({
        where: { id: lessonId }
      });
      
      return true;
    } catch (error) {
      return false;
    }
  }

  async markLessonComplete(userId: string, lessonId: string): Promise<Progress | null> {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: true
      }
    });

    if (!lesson) {
      return null;
    }

    // Check if user is enrolled in the course
    const courseProgress = await prisma.progress.findFirst({
      where: {
        userId,
        courseId: lesson.courseId,
        lessonId: null
      }
    });

    if (!courseProgress) {
      // Auto-enroll user in course
      await prisma.progress.create({
        data: {
          userId,
          courseId: lesson.courseId,
          percentComplete: 0
        }
      });
    }

    // Mark lesson as complete
    const lessonProgress = await prisma.progress.upsert({
      where: {
        userId_courseId_lessonId: {
          userId,
          courseId: lesson.courseId,
          lessonId
        }
      },
      update: {
        percentComplete: 100,
        completedAt: new Date()
      },
      create: {
        userId,
        courseId: lesson.courseId,
        lessonId,
        percentComplete: 100,
        completedAt: new Date()
      }
    });

    // Update course progress
    await this.updateCourseProgress(userId, lesson.courseId);

    return lessonProgress;
  }

  private async updateCourseProgress(userId: string, courseId: string): Promise<void> {
    // Get all lessons in the course
    const totalLessons = await prisma.lesson.count({
      where: { courseId }
    });

    if (totalLessons === 0) {
      return;
    }

    // Get completed lessons count
    const completedLessons = await prisma.progress.count({
      where: {
        userId,
        courseId,
        lessonId: { not: null },
        percentComplete: 100
      }
    });

    const courseProgress = Math.round((completedLessons / totalLessons) * 100);

    // Update course-level progress
    await prisma.progress.upsert({
      where: {
        userId_courseId_lessonId: {
          userId,
          courseId,
          lessonId: null
        }
      },
      update: {
        percentComplete: courseProgress,
        completedAt: courseProgress === 100 ? new Date() : null
      },
      create: {
        userId,
        courseId,
        percentComplete: courseProgress,
        completedAt: courseProgress === 100 ? new Date() : null
      }
    });
  }

  async getUserLessonProgress(userId: string, courseId: string) {
    return prisma.progress.findMany({
      where: {
        userId,
        courseId,
        lessonId: { not: null }
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            orderIndex: true,
          }
        }
      },
      orderBy: {
        lesson: {
          orderIndex: 'asc'
        }
      }
    });
  }
}