import { CourseUser, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { CourseUsersRepository } from '@/repositories/course-users-repository'

export class InMemoryCourseUsersRepository implements CourseUsersRepository {
  public courseUsers: CourseUser[] = []

  async findByStudentIdAndCourseId(studentId: string, courseId: string) {
    const courseUser = this.courseUsers.find(
      (item) => item.student_id === studentId && item.course_id === courseId,
    )

    if (!courseUser) {
      return null
    }

    return courseUser
  }

  async create(data: Prisma.CourseUserUncheckedCreateInput) {
    const courseUser = {
      id: randomUUID(),
      access_expires_in: new Date(data.access_expires_in),
      student_id: data.student_id,
      course_id: data.course_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.courseUsers.push(courseUser)

    return courseUser
  }

  async updateAccessTime(id: string, newAccessTime: Date) {
    const courseUserIndex = this.courseUsers.findIndex((item) => item.id === id)

    this.courseUsers[courseUserIndex].access_expires_in = newAccessTime
  }
}
