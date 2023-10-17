'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const segmentsWithNoPage = ['/bank'];

function constructSegments(pathName: string) {
  const homePath = '';
  const isIndexRoute = pathName === '/';
  const urlSegments = isIndexRoute ? [homePath] : pathName.split('/');

  const segments = urlSegments.map((segment, index) => {
    const fullPath = urlSegments.slice(0, index + 1).join('/');

    return {
      displayPath: fullPath === homePath ? 'Home' : segment,
      fullPath: fullPath === homePath ? '/' : fullPath,
      isLast: index === urlSegments.length - 1,
    };
  });

  return segments;
}

export default function BreadCrumb() {
  const pathName = usePathname();
  const paths = constructSegments(decodeURIComponent(pathName));

  return (
    <div className='mb-4'>
      {paths.map(({ fullPath, displayPath, isLast }) => {
        const segmentHasNoPage = segmentsWithNoPage.includes(fullPath);

        const withoutPath = <span className='py-1 px-2'>{displayPath}</span>;
        const withPath = (
          <Link
            className='hover:bg-neutral-100 py-1 px-2 rounded'
            href={fullPath}
          >
            {displayPath}
          </Link>
        );

        return (
          <span key={fullPath} className='text-xs capitalize inline-block'>
            {segmentHasNoPage ? withoutPath : withPath}
            {!isLast && <span className='p-1'>/</span>}
          </span>
        );
      })}
    </div>
  );
}
