import React, { useState } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Trash2, Pencil, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Card } from '../../types';
import styles from './StackView.module.css';
import clsx from 'clsx';

export const StackView: React.FC = () => {
  const { activeStackId, allCards, stacks, itemsOpen, setActiveStack, removeCard, moveCardToStack, dragOverStackId, setDragOverStackId } = useStore();
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

  // Close if no active stack or dock is minimized
  if (!activeStackId || !itemsOpen) return null;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, cardId: string) => {
    setIsDragging(false);
    setDragOverStackId(null);
    const { x, y } = info.offset;
    
    // Get drop coordinates safely
    // @ts-ignore
    const clientX = event.clientX ?? event.changedTouches?.[0]?.clientX;
    // @ts-ignore
    const clientY = event.clientY ?? event.changedTouches?.[0]?.clientY;

    // Check if dropped on a stack
    if (clientX && clientY) {
      const elements = document.elementsFromPoint(clientX, clientY);
      const stackElement = elements.find(el => el.getAttribute('data-stack-id'));
      
      if (stackElement) {
        const targetId = stackElement.getAttribute('data-stack-id');
        if (targetId && targetId !== activeStackId) {
          moveCardToStack(cardId, targetId);
          return; // Card moved, no further action needed (auto-removes from view)
        }
      }
    }

    // Drag Up to Delete
    if (y < -150) {
      removeCard(cardId);
    }
    // Drag Down to Close (only if not moved)
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

  const handleDrag = (_: any, info: PanInfo) => {
    // Detect drag over
    // @ts-ignore
    const point = info.point;
    const elements = document.elementsFromPoint(point.x, point.y);
    const stackElement = elements.find(el => el.getAttribute('data-stack-id'));
    const targetId = stackElement ? stackElement.getAttribute('data-stack-id') : null;
    
    if (targetId && targetId !== activeStackId) {
        if (dragOverStackId !== targetId) setDragOverStackId(targetId);
    } else {
        if (dragOverStackId !== null) setDragOverStackId(null);
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
                  dragSnapToOrigin
                  dragElastic={1}
                  onDragStart={() => isTop && setIsDragging(true)}
                  onDrag={isTop ? handleDrag : undefined}
                  onDragEnd={(e, info) => isTop && handleDragEnd(e, info, card.id)}
                  whileDrag={{ scale: 0.4, rotate: 0 }}
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
