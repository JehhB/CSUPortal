const STUDENT_PROFILE_ENDPOINT = "https://takay.csucarig.edu.ph/guid/profile";
const STUDENT_PICTURE_ENDPOINT =
  "https://takay.csucarig.edu.ph/guid/getStudentPic";

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
};

export type ProfilePictureResponse = {
  profpic: string | null;
  esig: string | null;
  remarks: string;
};

export class StudentProfileError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "StudentChecklistError";
  }
}

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

    try {
      const data: [StudentProfile] = await res.json();
      return data[0] ?? null;
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
};

export default profileService;
