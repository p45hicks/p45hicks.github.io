import type { JSX } from 'react';
import { useState, useEffect } from 'react';
import classNames from 'classnames';

/**
 * 
 * This file contains some basic card components that can be used to build the CV.
 * The styling is basic and can be easily overridden by passing in a className prop.
 * The components are designed to be flexible and can be used in a variety of ways.
 */


interface CardProps {
  className: string;
  children: JSX.Element | JSX.Element[];
}

/**
 * The Card component is a container that can be used to group related content together.
 * It is reactive and will adjust its layout based on the screen size.
 * It uses CSS grid to create a responsive layout that can adapt to different screen sizes.
 * 
 * @param props The props for the Card component, which include a className for styling and children to be rendered inside the card. 
 * @returns The React element representing the Card component.
 */
export function Card({ className, children }: CardProps): JSX.Element {
  return (
    <div className={classNames(className,
      'h-30 w-100 m-2',
      'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 p-4',
      'bg-gray-400 text-black dark:bg-gray-800 dark:text-gray-300',
      'border-2 rounded-lg border-gray-300 dark:border-black')}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: JSX.Element | JSX.Element[];
}
/**
 * The CardContent component is used to display the main content of the card.
 *
 * @param props The props for the CardContent component, which include children to be rendered inside the card content area. 
 * @returns The React element representing the Card component.
 */
export function CardContent({ children }: CardContentProps): JSX.Element {
  return (
    <div className='md:col-span-2 lg:col-span-4 grid-cols-subgrid md:grid-cols-3'>
      {children}
    </div>
  );
}

/**
 * The FlipCard component is a more complex component that can be used
 * to create a card that flips to reveal additional content on the back. 
 * It takes two sets of children: frontChildren and backChildren,
 * which are displayed on the front and back of the card, respectively.
 *
 * @param props The props for the FlipCard component, which include a
 *  className for styling, and children to be displayed on the card.
 *  Flipping can be manually configured by adding the correct classes to
 *  the children, or by using the FlipCardFront and FlipCardBack components.
 * @returns 
 */
export function FlipCard({ className, children }: CardProps): JSX.Element {
  return (
    <div className={classNames(className,
      'h-30 w-100 m-2',
      'group relative perspective-normal cursor-pointer'
    )}>
      {children}
    </div>
  );
}

export function FlipCardFront({ children }: CardContentProps): JSX.Element {
  return (
    <div className={classNames('absolute inset-0 h-full w-full',
      'bg-gray-400 text-black dark:bg-gray-800 dark:text-gray-300',
      'border-2 rounded-lg border-gray-300 dark:border-black',
      'backface-hidden',
      'transition-transform duration-500 transform-style-preserve-3d',
      'group-active:-rotate-y-180')}>
      {children}
    </div>
  );
}
export function FlipCardBack({ children }: CardContentProps): JSX.Element {
  return (
    <div className={classNames('absolute inset-0 h-full w-full',
      'bg-gray-400 text-black dark:bg-gray-800 dark:text-gray-300',
      'border-2 rounded-lg border-gray-300 dark:border-black',
      'backface-hidden',
      'transition-transform duration-500 transform-style-preserve-3d',
      'not-group-active:rotate-y-180')}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  children?: JSX.Element | JSX.Element[];
}
/**
 * The CardHeader component is used to display a title and optional content in the header of the card.
 * This component works with the Card (reactive width) and the FlipCard (fixed width) components, and will adjust its layout accordingly.
 *
 * @param props The props for the CardHeader component, which include a title to be displayed in the header and optional children to be rendered alongside the title.
 * @returns The React element representing the Card component.
 */
export function CardHeader({ title, children }: CardHeaderProps): JSX.Element {
  return (
    <div>
      <h1 className='col-span-1 text-2xl font-bold'>{title}</h1>
      {children}
    </div>
  );
}

/**
 * The CardDeck component displays multiple cards as a single card initially.
 * Clicking the card opens an expanded modal view where users can navigate through
 * the stacked cards using next/previous buttons or by clicking the card itself.
 *
 * Only two chilren are required: the top card (which is visible initially) and
 * the hidden deck of cards (that are revealed in the expanded view). 
 * Each child should be a complete card element (e.g., wrapped in a div with appropriate styling).
 * The component loops continuously - after the last card, it cycles back to the first.
 *
 * The JSX looks like this:
 * ```
 * <CardDeck>
 *   <TopCard>
 *     <div>...</div>
 *   </TopCard>
 *   <HiddenCards>
 *     <div>...</div>
 *     <div>...</div>
 *     <div>...</div>
 *   </HiddenCards>
 * </CardDeck>
 * ```
 *
 * Interactions:
 * - Click the card to expand and enter navigation mode
 * - Click card or use next/previous buttons to cycle through cards
 * - Press ESC or click the backdrop to close the expanded view
 * - Dot indicators show current position in the stack
 *
 * @param props The props for the StackedCard component, which include optional className and children (the stacked cards).
 * @returns The React element representing the StackedCard component.
 */
export function TopCard({ children }: { children: JSX.Element }) {
  return <>{children}</>;
}

export function HiddenCards({ children }: { children: JSX.Element[] }) {
  return <>{children}</>;
}
export function CardDeck({ className, children }: CardProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!children || !Array.isArray(children) || children.length < 2) {
    return <></>;
  }

  const baseCard: JSX.Element | undefined = children.find(child => child.type === TopCard)?.props.children;
  const hiddenCards: JSX.Element[] = children.find(child => child.type === HiddenCards)?.props.children;

  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % hiddenCards.length);
  };
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + hiddenCards.length) % hiddenCards.length);
  };
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setIsExpanded(false);
  };

  return (
    <>
      <div
        className={classNames(
          className,
          'w-100 h-30 m-2',
          'grid grid-cols-1 p-4',
          
          '',
          'bg-gray-400 text-black dark:bg-gray-800 dark:text-gray-300',
          'border-2 rounded-lg border-gray-300 dark:border-black',
          'cursor-pointer transition-transform hover:shadow-lg'
        )}
        onClick={() => setIsExpanded(true)}
      >
        {baseCard}
      </div>

      {isExpanded && hiddenCards.length > 0 && (
        <div
          className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'
          onClick={handleBackdropClick}
        >
          <div
            className={classNames(
              'relative w-full max-w-2xl max-h-[90vh] overflow-auto',
              'bg-gray-400 text-black dark:bg-gray-800 dark:text-gray-300',
              'border-2 rounded-lg border-gray-300 dark:border-black',
              'shadow-2xl'
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          >
            <div className='p-6'>
              {hiddenCards[currentIndex]}
            </div>

            <div className='absolute top-4 right-4 flex gap-2'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className='p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
                aria-label='Previous card'
              >
                ←
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className='p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
                aria-label='Next card'
              >
                →
              </button>
            </div>

            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
              {hiddenCards.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={classNames(
                    'w-2 h-2 rounded-full transition-all',
                    index === currentIndex
                      ? 'bg-black dark:bg-white w-8'
                      : 'bg-gray-500 dark:bg-gray-400 hover:bg-gray-600 dark:hover:bg-gray-300'
                  )}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
