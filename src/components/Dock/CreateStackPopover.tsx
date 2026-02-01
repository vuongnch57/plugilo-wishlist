import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, Gift, Zap, Book, Music, Coffee, Smile } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import styles from './CreateStackPopover.module.css';
import clsx from 'clsx';

interface CreateStackPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, cover: string) => void;
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

export const CreateStackPopover: React.FC<CreateStackPopoverProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('star');
  const [isPickingIcon, setIsPickingIcon] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  useClickOutside(popoverRef, onClose);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title.trim(), selectedIcon);
      setTitle('');
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
              maxLength={20}
            />

            <div className={styles.actions}>
              <button type="button" onClick={onClose} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" disabled={!title.trim()} className={styles.saveButton}>
                Save
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
