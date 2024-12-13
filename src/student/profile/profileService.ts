const STUDENT_PROFILE_ENDPOINT = "https://takay.csucarig.edu.ph/guid/profile";
const STUDENT_COLLEGE_ENDPOINT =
  "https://takay.csucarig.edu.ph/checkusercollege";
const STUDENT_PICTURE_ENDPOINT =
  "https://takay.csucarig.edu.ph/guid/getStudentPic";
const STUDENT_MSACCOUNT_ENDPOINT = "https://takay.csucarig.edu.ph/getMicrosoft";

export type StudentProfile = {
  ID: number;
  Type: number;
  IDNumber: string;
  LastName: string;
  FirstName: string;
  MiddleName: string;
  BithDate: string;
  BirthNo: string;
  BirthMinucipalityID: number;
  BirthCountryID: number;
  Gender: number;
  ReligionID: number;
  ScholarshipID: number | null;
  NationalityID: number;
  Foreigner: number;
  PassportNo: string;
  HomeNo: string;
  HomeStreet: string;
  HomeMinicipalityID: number;
  HomeCountryID: number;
  CivilStatus: number;
  MobileNo: string;
  Email: string;
  Guardian: string | null;
  GuardianContact: string | null;
  BordingNo: string;
  BordingStreet: string;
  BordingMunicipalityID: number;
  BordingCountryID: number;
  F138: number;
  F137A: number;
  NSO: number;
  BC: number;
  PC: number;
  NBIC: number;
  CC: number;
  CGM: number;
  MC: number;
  HD: number;
  TOR: number;
  CAT: number;
  NameExt: string | null;
  SHT: string;
  GWA: string;
  SexPref: string;
  SoloParent: number;
  TeenageParent: number;
  WChildren: number;
  YearConceived: string;
  Indigent: number;
  IndGroup: string | null;
  GrossIncome: string;
  WDisability: number;
  Disability: string | null;
  College: string;
  CollegeColor: string;
};

export type ProfilePictureResponse = {
  profpic: string | null;
  esig: string | null;
  remarks: string;
};

export type MSAccountResponse = {
  ID: number;
  IDNumber: string;
  DisplayName: string;
  Username: string;
  Password: string;
  CollegeCode: string;
  created_at: string;
  archive_at: string | null;
};

export class StudentProfileError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "StudentChecklistError";
  }
}

export const COLLEGES = new Map([
  [
    "coea",
    { label: "College of Engineering and Architecture", color: "#ba0d0d" },
  ],
  [
    "cics",
    {
      label: "College of Information and Computing Sciences",
      color: "#ba660d",
    },
  ],
  ["cit", { label: "College of Industrial Technology", color: "#38ba0d" }],
  [
    "cnsm",
    { label: "College of Natural Sciences and Mathematics", color: "#0d55ba" },
  ],
  [
    "chass",
    { label: "College of Humanities and Social Sciences", color: "#8f8f00" },
  ],
  ["cvm", { label: "College of Veterinary Medicine", color: "#5b0dba" }],
  ["com", { label: "College of Medicine", color: "#0dba30" }],
  ["cpad", { label: "College of Public Administration", color: "#ba0d41" }],
  ["chk", { label: "College of Human Kinetics", color: "#1b0dba" }],
]);

const profileService = {
  async get(accessToken: string | null) {
    if (accessToken == null) {
      throw new StudentProfileError("Failed to authenticate");
    }

    const res = await fetch(STUDENT_PROFILE_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new StudentProfileError(
        "Error encountered while fetching student profile",
      );
    }

    const collegeRes = await fetch(STUDENT_COLLEGE_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!collegeRes.ok) {
      throw new StudentProfileError(
        "Error encountered while fetching student college",
      );
    }

    try {
      const data: StudentProfile[] = await res.json();
      if (data.length < 1) return null;
      const profile = data[0];

      const college: string[] = await collegeRes.json();
      if (college.length < 1) return profile;

      const col = COLLEGES.get(college[0].toLowerCase());
      if (col !== undefined) {
        profile.College = col.label;
        profile.CollegeColor = col.color;
      } else {
        profile.College = college[0].toUpperCase();
        profile.CollegeColor = "#3c3c3c";
      }
      return profile;
    } catch (error) {
      console.warn(error);
      throw new StudentProfileError("Error encountered parsing response");
    }
  },

  async getPictures(accessToken: string | null) {
    if (accessToken == null) {
      throw new StudentProfileError("Failed to authenticate");
    }

    const res = await fetch(STUDENT_PICTURE_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new StudentProfileError(
        "Error encountered while fetching student pictures",
      );
    }

    try {
      const data: ProfilePictureResponse = await res.json();
      return data;
    } catch (error) {
      console.warn(error);
      throw new StudentProfileError("Error encountered parsing response");
    }
  },

  async getMSAccount(accessToken: string | null) {
    if (accessToken == null) {
      throw new StudentProfileError("Failed to authenticate");
    }

    const res = await fetch(STUDENT_MSACCOUNT_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new StudentProfileError(
        "Error encountered while fetching student microsoft account",
      );
    }

    try {
      const data: MSAccountResponse[] = await res.json();
      return data[0] ?? null;
    } catch (error) {
      console.warn(error);
      throw new StudentProfileError("Error encountered parsing response");
    }
  },
};

export default profileService;
