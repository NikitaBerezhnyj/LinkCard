import { IEditableLink } from "@/types/links";
import { IUserLink } from "@/types/user";
import { denormalizeLinkUrl } from "./linkNormalize";

function generateClientId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export function toEditableLinks(links: IUserLink[]): IEditableLink[] {
  return [...links]
    .sort((a, b) => a.order - b.order)
    .map(link => ({
      key: link.id,
      id: link.id,
      title: link.title,
      url: denormalizeLinkUrl(link.url)
    }));
}

export function createEmptyLink(): IEditableLink {
  return {
    key: generateClientId(),
    title: "",
    url: ""
  };
}
