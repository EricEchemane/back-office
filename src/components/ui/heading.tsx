import { cn } from '@/utils/cn';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  order?: 1 | 2 | 3 | 4;
}

export function Heading({ order = 1, className, ...props }: HeadingProps) {
  const headingClasses: Record<number, string> = {
    1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
    3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  };

  return (
    <h1 className={cn(headingClasses[order], className)} {...props}>
      {props.children}
    </h1>
  );
}
