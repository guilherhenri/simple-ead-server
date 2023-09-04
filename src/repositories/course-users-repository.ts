import { CourseUser, Prisma } from '@prisma/client'

export interface CourseUsersRepository {
  findByStudentIdAndCourseId(
    studentId: string,
    courseId: string,
  ): Promise<CourseUser | null>
  create(data: Prisma.CourseUserUncheckedCreateInput): Promise<CourseUser>
  updateAccessTime(id: string, newAccessTime: Date): Promise<void>
}
