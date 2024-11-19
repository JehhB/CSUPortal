import parseSchedString, { Schedule } from "./parseSchedString";

const STUDENT_SCHEDULE_ENDPOINT = "https://takay.csucarig.edu.ph/studSched";

export class StudentScheduleError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "StudentScheduleError";
  }
}

export type SubjectSchedule = {
  ClassCode: string;
  CourseCode: string;
  SubjectCode: string;
  SubjectDescription: string;
  Schedule: Schedule[];
  Teacher: string;
};

const scheduleService = {
  get: async (accessToken: string | null) => {
    if (accessToken == null) {
      throw new StudentScheduleError("Failed to authenticate");
    }

    const res = await fetch(STUDENT_SCHEDULE_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new StudentScheduleError("Failed to fetch schedule");
    }

    try {
      const { data }: { data: any[] } = await res.json();
      return data.map((v) => ({
        ...v,
        Schedule: parseSchedString(v.Schedule),
      })) as SubjectSchedule[];
    } catch (error) {
      console.warn(error);
      return [];
    }
  },
};

export default scheduleService;
