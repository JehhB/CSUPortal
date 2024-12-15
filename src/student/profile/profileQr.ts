import { StudentProfile } from "@/student/profile/profileService";
import { encodeAlphanumeric } from "@/util/encodeAlphanumeric";
import { digestStringAsync, CryptoDigestAlgorithm } from "expo-crypto";

const profileQr = {
  async generate(profile: StudentProfile | null) {
    if (!profile) {
      return null;
    }

    const data = encodeAlphanumeric(
      [profile.IDNumber, profile.LastName, profile.FirstName, Date.now()].join(
        "$",
      ),
    );

    const key = process.env.EXPO_PUBLIC_PROFILE_QR_KEY;
    const hash = await digestStringAsync(
      CryptoDigestAlgorithm.SHA256,
      data + key,
    );

    return `${data}$${hash}`.toUpperCase();
  },

  async verify(value: string) {
    try {
      const parts = value.split("$");
      if (parts.length !== 5) {
        return null;
      }

      const [encodedData, providedHash] = [
        parts.slice(0, 4).join("$"),
        parts[4],
      ];

      const key = process.env.EXPO_PUBLIC_PROFILE_QR_KEY;

      const verificationHash = await digestStringAsync(
        CryptoDigestAlgorithm.SHA256,
        encodedData + key,
      );

      if (verificationHash.toUpperCase() !== providedHash) {
        return null;
      }

      return {
        idNumber: parts[0],
        lastName: parts[1],
        firstName: parts[2],
        idCreatedAt: Number.parseInt(parts[3]),
      };
    } catch {
      return null;
    }
  },
};

export default profileQr;
