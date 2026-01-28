import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Search, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import styles from './Dock.module.css';
import clsx from 'clsx';

export const Dock: React.FC = () => {
  const { itemsOpen, toggleDock } = useStore();
  
  // Mock Stacks for visualization
  const stacks = [
    { id: '1', title: 'Summer' },
    { id: '2', title: 'Tech' },
    { id: '3', title: 'Gifts' },
    { id: '4', title: 'Books' },
    { id: '5', title: 'Ideas' },
  ];
  const activeStackId = '2';

  return (
    <div className={styles.dockContainer}>
      <AnimatePresence mode="wait">
        {itemsOpen ? (
          <motion.div
            className={styles.dockBar}
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
            key="dock-expanded"
          >
            {/* Brand Section */}
            <div className={styles.brandSection}>
              <div className={styles.brandIcon}>
                <Star size={16} fill="currentColor" />
              </div>
              <span className={styles.brandName}>plugilo</span>
            </div>

            <ChevronLeft size={16} color="#333" style={{ cursor: 'pointer' }} />

            {/* Stacks Scroll Area */}
            <div className={styles.stacksScrollArea}>
              {stacks.map((stack) => (
                <div key={stack.id} style={{ position: 'relative' }}>
                  <motion.div
                    className={clsx(styles.stackItem, stack.id === activeStackId && styles.active)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                  <div className={styles.stackLabel}>{stack.title}</div>
                </div>
              ))}

              {/* Add Stack Button */}
              <motion.button
                className={clsx(styles.stackItem, styles.addStack)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={20} />
              </motion.button>
            </div>

            <ChevronRight size={16} color="#333" style={{ cursor: 'pointer' }} />

            {/* Actions Section */}
            <div className={styles.actionsSection}>
              <button className={styles.actionButton}>
                <Search size={18} />
              </button>
              <button className={styles.actionButton} onClick={toggleDock}>
                <Minus size={18} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            className={styles.minimizedButton}
            onClick={toggleDock}
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            key="dock-minimized"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star size={24} fill="currentColor" />
            <div className={styles.badge}>{stacks.length}</div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
