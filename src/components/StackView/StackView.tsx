import React, { useState } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Trash2, Pencil, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';
import styles from './StackView.module.css';
import clsx from 'clsx';

export const StackView: React.FC = () => {
  const { activeStackId, allCards, setActiveStack, removeCard } = useStore();
  
  // Compute cards for this stack
  const stackCards = allCards.filter(c => c.stackId === activeStackId);
  
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Close if no active stack
  if (!activeStackId) return null;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, cardId: string) => {
    setIsDragging(false);
    setDragY(0);
    
    // Drag Up to Delete
    if (info.offset.y < -150) {
      removeCard(cardId);
      // Auto-advance is handled by re-render as card disappears
    }
    // Drag Down to Close/Move (Optional implementation: Close view)
    else if (info.offset.y > 150) {
       setActiveStack(null);
    }
  };

  const handleDrag = (_: any, info: PanInfo) => {
    setDragY(info.offset.y);
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setActiveStack(null)} // Click background to close
    >
      {/* Trash Zone */}
      <div className={clsx(styles.trashZone, isDragging && styles.visible, dragY < -100 && styles.active)}>
        <Trash2 size={24} />
      </div>

      <div className={styles.deckArea} onClick={(e) => e.stopPropagation()}>
        <AnimatePresence>
          {stackCards.length === 0 ? (
             <div className={styles.emptyState}>
                <p>No cards in this stack.<br/>Use the + button to add one.</p>
             </div>
          ) : (
            stackCards.map((card, index) => {
              // Stack Logic
              // We want to show only the top few cards.
              // Let's say we only render top 3 for performance? 
              // But simplistic approach: Render all, z-index handles default.
              // We need to visually offset them.
              // If index 0 is top.
              
              if (index > 2) return null; // Only render top 3

              const isTop = index === 0;
              
              return (
                <motion.div
                  key={card.id}
                  className={styles.card}
                  style={{
                    zIndex: stackCards.length - index,
                  }}
                  animate={{
                    scale: 1 - index * 0.05,
                    y: index * 10,
                    opacity: 1 - index * 0.2,
                  }}
                  drag={isTop ? "y" : false}
                  dragConstraints={{ top: -300, bottom: 300 }}
                  onDragStart={() => isTop && setIsDragging(true)}
                  onDrag={isTop ? handleDrag : undefined}
                  onDragEnd={(e, info) => isTop && handleDragEnd(e, info, card.id)}
                  whileDrag={{ scale: 1.05 }}
                  layout
                >
                  <div className={styles.cardContent}>
                     <div className={styles.cardIcon}>
                        <LinkIcon size={48} strokeWidth={1} />
                     </div>
                     <h3 className={styles.cardTitle}>{card.title}</h3>
                     {card.description && (
                        <a 
                          href={card.description} 
                          target="_blank" 
                          rel="noreferrer" 
                          className={styles.cardLink}
                          onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking link
                        >
                           <ExternalLink size={12} />
                           {(() => {
                              try { return new URL(card.description).hostname; } catch { return 'Link'; }
                           })()}
                        </a>
                     )}
                  </div>
                  
                  {/* Edit Button */}
                  <button className={styles.editButton}>
                    <Pencil size={16} />
                  </button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
