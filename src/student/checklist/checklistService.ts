const STUDENT_CHECKLIST_ENDPOINT =
  "https://takay.csucarig.edu.ph/studentChecklistAdvised";

export type AdvisedSubject = {
  ID: number;
  CurriculumID: number;
  CurriculumCode: string;
  SubjectID: number;
  SubjectCode: string;
  SubjectDescription: string;
  Units: number;
  LabUnits?: string | null;
  LecUnits?: string | null;
  LabHours?: string | null;
  LecHours?: string | null;
  SubjectYearDescription: string;
  TermDescription: string;
  PreRequisiteID?: number | null;
  PreRequisiteCode?: string | null;
  SubjectType: string;
  TermID: number;
  Remarks?: number | string;
  Grade?: string | null;
  PeriodTaken?: string | null;
  Description?: string;
  Teacher?: string | null;
};

export type ChecklistResponse = [
  advisedSubjects: AdvisedSubject[],
  unknown1: any[],
  curriculumCode: string,
  unknown2: any[],
];

export class StudentChecklistError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "StudentChecklistError";
  }
}

const checklistService = {
  async get(accessToken: string | null) {
    if (accessToken == null) {
      throw new StudentChecklistError("Failed to authenticate");
    }

    const res = await fetch(STUDENT_CHECKLIST_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new StudentChecklistError(
        "Error encountered while fetching checklist",
      );
    }

    try {
      const data: ChecklistResponse = await res.json();
      return data[0] ?? null;
    } catch (error) {
      console.warn(error);
      return null;
    }
  },
};

export default checklistService;
