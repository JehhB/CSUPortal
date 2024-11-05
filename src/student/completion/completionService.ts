const STUDENT_COMPLETION_ENDPOINT =
  "https://takay.csucarig.edu.ph/studentCompletion";

export type StudentCompletion = {
  IDNumber: string;
  LastName: string;
  FirstName: string;
  MiddleName: string;
  CourseCode: string;
  MajorCode: string;
  CurriculumCode: string;
  FinishedSubjects: number;
  SubjectCount: number;
};

export class StudentCompletionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "StudentCompletionError";
  }
}

const completionService = {
  async get(accessToken: string | null) {
    if (accessToken == null) {
      throw new StudentCompletionError("Failed to authenticate");
    }

    const res = await fetch(STUDENT_COMPLETION_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new StudentCompletionError(
        "Error encountered while fetching completion",
      );
    }

    const data: StudentCompletion[] = await res.json();

    return data.at(0) ?? null;
  },
};

export default completionService;
