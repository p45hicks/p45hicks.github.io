import type { JSX } from 'react';

export function Card({ className, children }: { className: string, children: JSX.Element | JSX.Element[] }): JSX.Element {
    return (
        <div className={`${className} grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-5 p-4
         bg-gray-400 text-black dark:bg-gray-800 dark:text-gray-300
         border-2 rounded-lg border-gray-300 dark:border-black`}>
            {children}
        </div>
    );
}

export function CardHeader({ title }: { title: string }): JSX.Element {
    return (
        <h1 className='col-span-1 text-2xl font-bold'>{title}</h1>
    );
}

export function CardContent({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element {
    return (
        <div className='sm:col-span-2 md:col-span-4 lg:col-span-6 grid-cols-subgrid md:grid-cols-3'>
            {children}
        </div>
    );
}
