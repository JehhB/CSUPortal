const STUDENT_GWA_ENPOINT = "https://takay.csucarig.edu.ph/studentGwa";

export class StudentGwaError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "StudentGwaError";
  }
}

export type StudentGwa = {
  [year: string]: {
      ID: number;
      Year: number;
      Section: string;
      UnitsEnrolled: number;
      SubjectsEnrolled: number;
      UnitsEarned: number;
      SubjectsEarned: string | number;
      GradesEarned: number | null;
      PeriodCode: string;
    }[][];
};

const gwaService = {
  async get(accessToken: string | null) {
    if (accessToken == null) {
      throw new StudentGwaError("Failed to authenticate");
    }

    const res = await fetch(STUDENT_GWA_ENPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new StudentGwaError("Error encountered while fetching gwa");
    }

    const data: StudentGwa = await res.json();

    return data;
  },
};

export default gwaService;
