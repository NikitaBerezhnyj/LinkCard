"use client";

import { TextField } from "@/components/ui/TextField/TextField";
import { IEditableLink } from "@/types/links";
import { getLinkIcon } from "@/utils/getLinkIcon";
import { getRandomLinkPlaceholder } from "@/utils/getRandomLinkPlaceholder";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { FaGripVertical, FaTrash } from "react-icons/fa6";
import styles from "./LinkRow.module.scss";

interface LinkRowProps {
  link: IEditableLink;
  dragId: string;
  onChange: (patch: Partial<IEditableLink>) => void;
  onRemove: () => void;
}

export function LinkRow({ link, dragId, onChange, onRemove }: LinkRowProps) {
  const [placeholder] = useState(getRandomLinkPlaceholder);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: dragId
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.row}>
      <button
        type="button"
        className={styles.handle}
        aria-label="Перетягнути для зміни порядку"
        {...attributes}
        {...listeners}
      >
        <FaGripVertical />
      </button>
      <span className={styles.icon}>{getLinkIcon(link.url || "https://")}</span>
      <div className={styles.fields}>
        <TextField
          id={`link-title-${dragId}`}
          label="Назва"
          placeholder={placeholder.name}
          value={link.title}
          onChange={e => onChange({ title: e.target.value })}
        />
        <TextField
          id={`link-url-${dragId}`}
          label="Посилання"
          placeholder={placeholder.url}
          value={link.url}
          onChange={e => onChange({ url: e.target.value })}
        />
      </div>
      <button
        type="button"
        className={styles.removeButton}
        onClick={onRemove}
        aria-label="Видалити посилання"
      >
        <FaTrash />
      </button>
    </div>
  );
}
