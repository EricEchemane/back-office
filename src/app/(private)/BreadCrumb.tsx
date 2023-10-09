'use client';

import { strings } from '@/utils/strings';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const segmentsWithNoPage = ['/bank'];

function constructSegments(pathName: string) {
  const homePath = '';
  const isIndexRoute = pathName === '/';
  const urlSegments = isIndexRoute ? [homePath] : pathName.split('/');

  const segments = urlSegments.map((segment, index) => {
    const fullPath = urlSegments.slice(0, index + 1).join('/');

    segment = strings.titleCase(segment);

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
  const paths = constructSegments(pathName);

  return (
    <div className='mb-4'>
      {paths.map(({ fullPath, displayPath, isLast }) => {
        let DisplayPath = (
          <Link
            className='hover:bg-neutral-100 py-1 px-2 rounded'
            href={fullPath}
          >
            {displayPath}
          </Link>
        );

        if (segmentsWithNoPage.includes(fullPath)) {
          DisplayPath = <span className='py-1 px-2'>{displayPath}</span>;
        }

        return (
          <span key={fullPath} className='text-xs'>
            {DisplayPath}
            {!isLast && <span className='p-1'>/</span>}
          </span>
        );
      })}
    </div>
  );
}
