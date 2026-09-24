"use client";

import { Button } from "@/components/ui/Button/Button";
import { SectionCard } from "@/components/ui/SectionCard/SectionCard";
import { MAX_LINKS } from "@/constants/constants";
import { useUpdateLinks } from "@/hooks/dashboard/useUpdateLinks";
import { IEditableLink } from "@/types/links";
import { IUser } from "@/types/user";
import { getComparableLinks } from "@/utils/getComparableLinks";
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
import { toast } from "sonner";
import { LinkRow } from "./LinkRow";
import styles from "./LinksSection.module.scss";

export function LinksSection({ user }: { user: IUser }) {
  const [links, setLinks] = useState<IEditableLink[]>(() => toEditableLinks(user.links));
  const [initialLinks, setInitialLinks] = useState(() =>
    getComparableLinks(toEditableLinks(user.links))
  );

  const updateLinks = useUpdateLinks();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const currentLinks = getComparableLinks(links);
  const hasChanges = JSON.stringify(currentLinks) !== JSON.stringify(initialLinks);

  function handleChange(key: string, patch: Partial<IEditableLink>) {
    setLinks(prev => prev.map(link => (link.key === key ? { ...link, ...patch } : link)));
  }

  function handleRemove(key: string) {
    setLinks(prev => prev.filter(link => link.key !== key));
  }

  function handleAdd() {
    if (links.length >= MAX_LINKS) {
      toast.warning(`Забагато посилань. Максимальна кількість ${MAX_LINKS}`);
      return;
    }

    setLinks(prev => [...prev, createEmptyLink()]);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setLinks(prev => {
      const oldIndex = prev.findIndex(link => link.key === active.id);
      const newIndex = prev.findIndex(link => link.key === over.id);

      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  function handleSave() {
    const payload = getComparableLinks(links);

    updateLinks.mutate(payload, {
      onSuccess: updatedUser => {
        const updatedLinks = toEditableLinks(updatedUser.links);

        setLinks(updatedLinks);
        setInitialLinks(getComparableLinks(updatedLinks));
      }
    });
  }

  return (
    <SectionCard
      title="Посилання"
      description="Перетягуйте, щоб змінити порядок на картці."
      footer={
        <Button type="button" onClick={handleSave} disabled={updateLinks.isPending || !hasChanges}>
          {updateLinks.isPending ? "Збереження..." : "Зберегти посилання"}
        </Button>
      }
    >
      <div className={styles.editor}>
        {links.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={links.map(link => link.key)}
              strategy={verticalListSortingStrategy}
            >
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
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Поки що немає посилань</p>
            <p className={styles.emptyText}>
              Додайте соцмережі, сайт чи будь-що, чим хочете поділитися.
            </p>
          </div>
        )}

        <button type="button" className={styles.addButton} onClick={handleAdd}>
          <FaPlus /> Додати посилання
        </button>
      </div>
    </SectionCard>
  );
}
