import React, { useState } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Trash2, Pencil, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Card } from '../../types';
import styles from './StackView.module.css';
import clsx from 'clsx';

export const StackView: React.FC = () => {
  const { activeStackId, allCards, stacks, setActiveStack, removeCard } = useStore();
  const [orderedCards, setOrderedCards] = useState<Card[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate source cards from store
  const sourceCards = React.useMemo(() => {
    if (!activeStackId) return [];
    const activeStack = stacks.find(s => s.id === activeStackId);
    if (activeStack && activeStack.cardIds) {
      return activeStack.cardIds
        .map(id => allCards.find(c => c.id === id))
        .filter((c): c is Card => !!c);
    }
    return allCards.filter(c => c.stackId === activeStackId);
  }, [activeStackId, allCards, stacks]);

  const [lastSourceHash, setLastSourceHash] = useState('');
  
  // Sync state during render if source changes
  const sourceHash = sourceCards.map(c => c.id).join(',') + activeStackId;
  if (sourceHash !== lastSourceHash) {
    setLastSourceHash(sourceHash);
    setOrderedCards(sourceCards);
  }

  // Close if no active stack
  if (!activeStackId) return null;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, cardId: string) => {
    setIsDragging(false);
    const { x, y } = info.offset;

    // Drag Up to Delete
    if (y < -150) {
      removeCard(cardId);
    }
    // Drag Down to Close
    else if (y > 150) {
       setActiveStack(null);
    }
    // Swipe Left (Next)
    else if (x < -100) {
       setOrderedCards(prev => {
         const [first, ...rest] = prev;
         return [...rest, first];
       });
    }
    // Swipe Right (Prev - Bring bottom to top)
    else if (x > 100) {
       setOrderedCards(prev => {
         const last = prev[prev.length - 1];
         const rest = prev.slice(0, prev.length - 1);
         return [last, ...rest];
       });
    }
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
      <div className={clsx(styles.trashZone, isDragging && styles.visible)}>
        <Trash2 size={24} />
      </div>

      <div className={styles.deckArea} onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode='popLayout'>
          {orderedCards.length === 0 ? (
             <div className={styles.emptyState}>
                <p>No cards in this stack.<br/>Use the + button to add one.</p>
             </div>
          ) : (
            orderedCards.map((card, index) => {
              // Stack Logic: Fan out effect
              if (index > 3) return null; 

              const isTop = index === 0;
              
              return (
                <motion.div
                  key={card.id}
                  className={styles.card}
                  style={{
                    zIndex: orderedCards.length - index,
                  }}
                  animate={{
                    scale: 1,
                    rotate: index * 4,
                    x: index * 6,
                    y: 0,
                    opacity: 1,
                  }}
                  drag={isTop ? true : false}
                  dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }} // Snap back if released
                  dragElastic={0.2}
                  onDragStart={() => isTop && setIsDragging(true)}
                  onDragEnd={(e, info) => isTop && handleDragEnd(e, info, card.id)}
                  whileDrag={{ scale: 1.05, rotate: 0 }}
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
                          onPointerDown={(e) => e.stopPropagation()} 
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
                    <Pencil size={18} />
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
