import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '../../hooks/useClickOutside';
import styles from './CreateMenuPopover.module.css';

interface CreateMenuPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStack: () => void;
  onSelectCard: () => void;
}

export const CreateMenuPopover: React.FC<CreateMenuPopoverProps> = ({
  isOpen,
  onClose,
  onSelectStack,
  onSelectCard
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  useClickOutside(popoverRef, onClose);

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
          <div className={styles.header}>Create</div>
          <div className={styles.menu}>
            <button className={styles.menuItem} onClick={onSelectCard}>
              Card
            </button>
            <button className={styles.menuItem} onClick={onSelectStack}>
              Stack
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
