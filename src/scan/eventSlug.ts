import * as Crypto from "expo-crypto";
import { Event } from "@/scan/useScanEvents";
import slugify from "slugify";

const eventSlug = {
  async shortHash(id: string) {
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      id,
    );
    return hash.slice(0, 8);
  },

  async slugify(event: Event) {
    const safeEventName = slugify(event.name, {
      lower: true,
      strict: true,
    });
    const hash = await this.shortHash(event.id);
    return { ...event, slug: `${safeEventName}-${hash}` };
  },

  get(events: Event[], slug: string) {
    return events.find((event) => event.slug === slug) ?? null;
  },
};

export default eventSlug;
