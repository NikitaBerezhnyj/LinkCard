"use client";

import { Button } from "@/components/ui/Button/Button";
import { SectionCard } from "@/components/ui/SectionCard/SectionCard";
import { useUpdateLinks } from "@/hooks/dashboard/useUpdateLinks";
import { IEditableLink } from "@/types/links";
import { IUser } from "@/types/user";
import { normalizeLinkUrl } from "@/utils/linkNormalize";
import { createEmptyLink, toEditableLinks } from "@/utils/toEditableLinks";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { LinkRow } from "./LinkRow";
import styles from "./LinksSection.module.scss";

export function LinksSection({ user }: { user: IUser }) {
  const [links, setLinks] = useState<IEditableLink[]>(() => toEditableLinks(user.links));
  const updateLinks = useUpdateLinks();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function handleChange(key: string, patch: Partial<IEditableLink>) {
    setLinks(prev => prev.map(link => (link.key === key ? { ...link, ...patch } : link)));
  }

  function handleRemove(key: string) {
    setLinks(prev => prev.filter(link => link.key !== key));
  }

  function handleAdd() {
    setLinks(prev => [...prev, createEmptyLink()]);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setLinks(prev => {
      const oldIndex = prev.findIndex(link => link.key === active.id);
      const newIndex = prev.findIndex(link => link.key === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  function handleSave() {
    const payload = links
      .filter(link => link.title.trim() && link.url.trim())
      .map(link => ({
        id: link.id,
        title: link.title.trim(),
        url: normalizeLinkUrl(link.url.trim())
      }));

    updateLinks.mutate(payload, {
      onSuccess: updatedUser => {
        setLinks(toEditableLinks(updatedUser.links));
      }
    });
  }

  return (
    <SectionCard title="Посилання" description="Перетягуйте, щоб змінити порядок на картці.">
      {links.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={links.map(l => l.key)} strategy={verticalListSortingStrategy}>
            <div className={styles.list}>
              {links.map(link => (
                <LinkRow
                  key={link.key}
                  dragId={link.key}
                  link={link}
                  onChange={patch => handleChange(link.key, patch)}
                  onRemove={() => handleRemove(link.key)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={handleAdd}>
          <FaPlus /> Додати посилання
        </Button>
        <Button type="button" onClick={handleSave} disabled={updateLinks.isPending}>
          {updateLinks.isPending ? "Збереження..." : "Зберегти посилання"}
        </Button>
      </div>
    </SectionCard>
  );
}
