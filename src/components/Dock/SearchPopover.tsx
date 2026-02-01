import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import styles from './SearchPopover.module.css';

interface SearchPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
}

export const SearchPopover: React.FC<SearchPopoverProps> = ({
  isOpen,
  onClose,
  query,
  onQueryChange
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  useClickOutside(popoverRef, onClose);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          className={styles.popover}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
        >
          <div className={styles.searchInputWrapper}>
            <Search size={16} className={styles.searchIcon} />
            <input
              ref={inputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Search stacks and cards..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
