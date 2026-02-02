import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Search, Minus, ChevronLeft, ChevronRight, Heart, Gift, Zap, Book, Music, Coffee, Smile } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { CreateStackPopover } from './CreateStackPopover';
import { CreateCardPopover } from './CreateCardPopover';
import { CreateMenuPopover } from './CreateMenuPopover';
import styles from './Dock.module.css';
import { SearchPopover } from './SearchPopover';
import { StackOptionsPopover } from './StackOptionsPopover';
import clsx from 'clsx';
import { MoreHorizontal } from 'lucide-react';

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

type ActivePopover = 'none' | 'menu' | 'stack' | 'card' | 'search';

export const Dock: React.FC = () => {
  const { itemsOpen, toggleDock, stacks, activeStackId, dragOverStackId, setActiveStack, addStack, addCard, allCards, removeStack } = useStore();
  const [activePopover, setActivePopover] = useState<ActivePopover>('none');
  const [searchQuery, setSearchQuery] = useState('');
  const [stackOptions, setStackOptions] = useState<{ id: string, x: number, y: number } | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const filteredStacks = React.useMemo(() => {
    if (!searchQuery.trim()) return stacks;
    const lowerQuery = searchQuery.toLowerCase();
    return stacks.filter(stack => {
       const titleMatch = stack.title.toLowerCase().includes(lowerQuery);
       const hasMatchingCard = stack.cardIds?.some(cid => {
          const card = allCards.find(c => c.id === cid);
          return card && (card.title.toLowerCase().includes(lowerQuery) || card.description?.toLowerCase().includes(lowerQuery));
       });
       return titleMatch || hasMatchingCard;
    });
  }, [stacks, allCards, searchQuery]);

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
              {filteredStacks.map((stack) => {
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
                       {stack.cardIds.length > 0 && (
                          <div className={styles.stackBadge}>{stack.cardIds.length}</div>
                       )}
                    </motion.div>
                    <div className={styles.stackLabelWrapper}>
                       <div className={styles.stackLabel}>{stack.title}</div>
                       <button className={styles.optionsButton} onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setStackOptions({ id: stack.id, x: rect.left + rect.width / 2, y: rect.top });
                       }}>
                         <MoreHorizontal size={12} />
                       </button>
                    </div>  
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
              <button 
                className={clsx(styles.actionButton, activePopover === 'search' && styles.active)}
                onClick={() => setActivePopover(activePopover === 'search' ? 'none' : 'search')}
              >
                <Search size={18} />
              </button>
              <button className={styles.actionButton} onClick={toggleDock}>
                <Minus size={18} />
              </button>
            </div>

            {/* Popovers */}
            <SearchPopover 
                isOpen={activePopover === 'search'} 
                onClose={() => { setActivePopover('none'); setSearchQuery(''); }}
                query={searchQuery}
                onQueryChange={setSearchQuery}
            />

            <StackOptionsPopover 
              isOpen={!!stackOptions}
              position={stackOptions ? { x: stackOptions.x, y: stackOptions.y } : { x: 0, y: 0 }}
              onClose={() => setStackOptions(null)}
              onEdit={() => {
                 setStackOptions(null);
                 // Edit logic to be implemented or connected to CreateStackPopover
                 alert("Edit feature coming soon!"); 
              }}
              onDelete={() => {
                 if (stackOptions) removeStack(stackOptions.id);
                 setStackOptions(null);
              }}
            />

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
