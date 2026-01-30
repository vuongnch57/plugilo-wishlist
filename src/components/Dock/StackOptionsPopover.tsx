import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, X } from 'lucide-react';
import styles from './StackOptionsPopover.module.css';

interface StackOptionsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  position: { x: number; y: number };
}

export const StackOptionsPopover: React.FC<StackOptionsPopoverProps> = ({ 
  isOpen, 
  onClose,
  onEdit,
  onDelete,
  position
}) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
      <motion.div 
        className={styles.popover}
        style={{ left: position.x, top: position.y }}
        initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-100%" }}
        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-100%" }}
        exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-100%" }}
        transition={{ type: "spring", bounce: 0, duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
            <span className={styles.title}>Options</span>
            <button className={styles.closeButton} onClick={onClose}><X size={14}/></button>
        </div>
        <div className={styles.menu}>
          <button className={styles.menuItem} onClick={onEdit}>
            <Edit2 size={16} />
            <span>Edit</span>
          </button>
          <button className={`${styles.menuItem} ${styles.delete}`} onClick={onDelete}>
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
