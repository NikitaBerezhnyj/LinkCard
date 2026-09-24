import { IEditableLink } from "@/types/links";
import { normalizeLinkUrl } from "./linkNormalize";

export function getComparableLinks(links: IEditableLink[]) {
  return links
    .filter(link => link.title.trim() && link.url.trim())
    .map(link => ({
      id: link.id,
      title: link.title.trim(),
      url: normalizeLinkUrl(link.url.trim())
    }));
}
