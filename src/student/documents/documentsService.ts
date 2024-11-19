const GET_DOCUMENT_ENDPOINT = "https://takay.csucarig.edu.ph/reqDoc";

const DOCUMENT_TYPES = {
  COG: "COG",
  COE: "COE",
  Assesment: "A",
};

export type DocumentRequestResponse = {
  ControlNo: string;
  periods: string;
};

export type DocumentType = keyof typeof DOCUMENT_TYPES;
export type DocumentServiceGetOptions = {
  accessToken: string | null;
  period: string | null;
  type: DocumentType;
};

export class StudentDocumentsError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "StudentDocumentsError";
  }
}

const documentService = {
  get: async ({ accessToken, period, type }: DocumentServiceGetOptions) => {
    if (accessToken === null || period === null) return null;

    const reqPayload = JSON.stringify({
      doc: DOCUMENT_TYPES[type],
      periods: period,
    });

    const res = await fetch(GET_DOCUMENT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: reqPayload,
    });

    if (!res.ok)
      throw new StudentDocumentsError("Failed to get document control number");

    try {
      const {
        ControlNo: controlNum,
        periods: docPeriod,
      }: DocumentRequestResponse = await res.json();

      if (type === "COG") {
        return `https://takay.csucarig.edu.ph/printcog/${btoa(controlNum)}/${btoa(docPeriod)}/?token=${accessToken}`;
      } else if (type === "COE") {
        return `https://takay.csucarig.edu.ph/printcoe/${btoa(controlNum)}/${btoa(docPeriod)}/?token=${accessToken}`;
      } else {
        return `https://takay.csucarig.edu.ph/printass/${btoa(controlNum)}/${btoa(docPeriod)}/?token=${accessToken}`;
      }
    } catch (error) {
      console.warn(error);
      throw new StudentDocumentsError(
        "Failed to interpret response from server",
      );
    }
  },
};

export default documentService;
