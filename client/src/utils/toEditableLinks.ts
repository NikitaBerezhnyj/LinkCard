import { IUserLink } from "@/types/user";
import { IEditableLink } from "@/types/links";

function generateClientId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export function toEditableLinks(links: IUserLink[]): IEditableLink[] {
  return [...links]
    .sort((a, b) => a.order - b.order)
    .map(({ id, title, url }) => ({ key: generateClientId(), id, title, url }));
}

export function createEmptyLink(): IEditableLink {
  return { key: generateClientId(), title: "", url: "" };
}
