const PERIOD_ENDPOINT = "https://takay.csucarig.edu.ph/getCRPData";

export type PeriodResponse = {
  PeriodCode: string;
}[];

export class PeriodError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "PeriodError";
  }
}

const periodService = {
  get: async (accessToken: string | null) => {
    if (accessToken == null) {
      throw new PeriodError("Failed to authenticate");
    }

    const res = await fetch(PERIOD_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new PeriodError("Error encountered while fetching completion");
    }

    try {
      return (await res.json()) as PeriodResponse;
    } catch (e) {
      console.warn(e);
      return null;
    }
  },
};

export default periodService;
