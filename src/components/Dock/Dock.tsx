import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Search, Minus, ChevronLeft, ChevronRight, Heart, Gift, Zap, Book, Music, Coffee, Smile } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { CreateStackPopover } from './CreateStackPopover';
import { CreateCardPopover } from './CreateCardPopover';
import { CreateMenuPopover } from './CreateMenuPopover';
import styles from './Dock.module.css';
import clsx from 'clsx';

const ICONS_MAP: Record<string, React.ElementType> = {
  star: Star,
  heart: Heart,
  gift: Gift,
  zap: Zap,
  book: Book,
  music: Music,
  coffee: Coffee,
  smile: Smile,
};

type ActivePopover = 'none' | 'menu' | 'stack' | 'card';

export const Dock: React.FC = () => {
  const { itemsOpen, toggleDock, stacks, activeStackId, dragOverStackId, setActiveStack, addStack, addCard } = useStore();
  const [activePopover, setActivePopover] = useState<ActivePopover>('none');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };
  
  const handleCreateStack = (title: string, cover: string) => {
    addStack(title, cover);
    setActivePopover('none');
  };

  const handleCreateCard = (stackId: string, title: string, description: string, cover: string) => {
    addCard(stackId, title, description, cover);
    setActivePopover('none');
  };

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

            <ChevronLeft size={16} className={styles.chevron} onClick={() => scroll('left')} />

            {/* Stacks Scroll Area */}
            <div className={styles.stacksScrollArea} ref={scrollRef}>
              {stacks.map((stack) => {
                const IconComponent = stack.cover && ICONS_MAP[stack.cover] ? ICONS_MAP[stack.cover] : Star;
                const isDragTarget = stack.id === dragOverStackId;
                return (
                  <div key={stack.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <motion.div
                      className={clsx(styles.stackItem, stack.id === activeStackId && styles.active)}
                      whileHover={{ scale: 1.05 }}
                      animate={{ 
                        scale: isDragTarget ? 1.2 : 1,
                        borderColor: isDragTarget ? '#007AFF' : (stack.id === activeStackId ? '#007AFF' : 'transparent'),
                        backgroundColor: isDragTarget ? '#007AFF' : undefined
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveStack(stack.id)}
                      data-stack-id={stack.id}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                       <IconComponent size={24} color={isDragTarget ? '#FFF' : (activeStackId === stack.id ? '#007AFF' : '#666')} />
                    </motion.div>
                    <div className={styles.stackLabel}>{stack.title}</div>
                  </div>
                );
              })}
            </div>

            <ChevronRight size={16} className={styles.chevron} onClick={() => scroll('right')} />

            <div className={styles.divider} />

            {/* Add Stack/Card Button */}
            <motion.button
              className={clsx(styles.stackItem, styles.addStack)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePopover(activePopover === 'none' ? 'menu' : 'none')}
            >
              <Plus size={20} />
            </motion.button>

            {/* Actions Section */}
            <div className={styles.actionsSection}>
              <button className={styles.actionButton}>
                <Search size={18} />
              </button>
              <button className={styles.actionButton} onClick={toggleDock}>
                <Minus size={18} />
              </button>
            </div>

            {/* Popovers */}
            <div style={{ position: 'absolute', bottom: '100%', right: '60px' }}>
                <CreateMenuPopover 
                    isOpen={activePopover === 'menu'} 
                    onClose={() => setActivePopover('none')}
                    onSelectStack={() => setActivePopover('stack')}
                    onSelectCard={() => setActivePopover('card')}
                />
            </div>
            
             <CreateStackPopover 
              isOpen={activePopover === 'stack'} 
              onClose={() => setActivePopover('none')} 
              onCreate={handleCreateStack}
            />

            <CreateCardPopover 
              isOpen={activePopover === 'card'} 
              onClose={() => setActivePopover('none')} 
              onCreate={handleCreateCard}
              stacks={stacks}
              activeStackId={activeStackId}
            />
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
