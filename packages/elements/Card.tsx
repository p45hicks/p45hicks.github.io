import type { JSX } from 'react';
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
    <div className={classNames(className, 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 p-4',
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
