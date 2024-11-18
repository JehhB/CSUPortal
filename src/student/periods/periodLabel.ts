import toOrdinal from "@/util/toOrdinal";

export default function periodLabel(period: string | null): string {
  if (period === null) return "Not taken";
  const [semester, startYear, endYear] = period.split("-");

  if (semester === "S") {
    return `Summer '${startYear}-'${endYear}`;
  } else {
    const ordinalSemester = toOrdinal(Number(semester));
    return `${ordinalSemester} Semester '${startYear}-'${endYear}`;
  }
}
