import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, Gift, Zap, Book, Music, Coffee, Smile } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import styles from './CreateCardPopover.module.css';
import clsx from 'clsx';
import type { Stack } from '../../types';

interface CreateCardPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (stackId: string, title: string, description: string, cover: string) => void;
  stacks: Stack[];
  activeStackId: string | null;
}

const ICONS = [
  { name: 'star', Icon: Star },
  { name: 'heart', Icon: Heart },
  { name: 'gift', Icon: Gift },
  { name: 'zap', Icon: Zap },
  { name: 'book', Icon: Book },
  { name: 'music', Icon: Music },
  { name: 'coffee', Icon: Coffee },
  { name: 'smile', Icon: Smile },
];

export const CreateCardPopover: React.FC<CreateCardPopoverProps> = ({
  isOpen,
  onClose,
  onCreate,
  stacks,
  activeStackId
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStackId, setSelectedStackId] = useState(activeStackId || (stacks[0]?.id || ''));
  const [selectedIcon, setSelectedIcon] = useState('star');
  const [isPickingIcon, setIsPickingIcon] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  useClickOutside(popoverRef, onClose);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      // Update selected stack if activeStackId changes or just initial open
      if (activeStackId) setSelectedStackId(activeStackId);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [isOpen, activeStackId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && selectedStackId) {
      onCreate(selectedStackId, title.trim(), description.trim(), selectedIcon);
      onClose();
    }
  };

  const SelectedIconComponent = ICONS.find(i => i.name === selectedIcon)?.Icon || Star;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          className={styles.popover}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.coverSection}>
            <div
              className={styles.coverPreview}
              onClick={() => setIsPickingIcon(!isPickingIcon)}
            >
              {isPickingIcon ? (
                <div className={styles.iconGrid}>
                  {ICONS.map(({ name, Icon }) => (
                    <div
                      key={name}
                      className={clsx(styles.iconOption, selectedIcon === name && styles.selected)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIcon(name);
                        setIsPickingIcon(false);
                      }}
                    >
                      <Icon size={20} />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <SelectedIconComponent size={48} strokeWidth={1.5} />
                  <span className={styles.coverLabel}>Tap to change icon</span>
                </>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              placeholder="Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={40}
            />

            <input
              type="text"
              className={styles.input}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={100}
            />

            <select
              className={styles.select}
              value={selectedStackId}
              onChange={(e) => setSelectedStackId(e.target.value)}
            >
              {stacks.map(stack => (
                <option key={stack.id} value={stack.id}>
                  {stack.title}
                </option>
              ))}
            </select>

            <div className={styles.actions}>
              <button type="button" onClick={onClose} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" disabled={!title.trim() || !selectedStackId} className={styles.saveButton}>
                Save
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
