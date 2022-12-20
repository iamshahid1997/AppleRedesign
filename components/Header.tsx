import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { selectBasketItems } from '../redux/basketSlice';
import { signIn, signOut, useSession } from 'next-auth/react';

const HEADER = [
  {
    header: 'Product',
    link: '/product',
  },
  {
    header: 'Explore',
    link: '/explore',
  },
  {
    header: 'Support',
    link: '/support',
  },
  {
    header: 'Business',
    link: '/business',
  },
];

function Header() {
  const { data: session } = useSession();
  const items = useSelector(selectBasketItems);
  return (
    <header className='sticky top-0 z-40 flex w-full items-center justify-between bg-background'>
      <div className='flex items-center justify-center pl-5 md:w-1/5 md:pl-0'>
        <Link href='/'>
          <div className='relative h-10 w-5 cursor-pointer opacity-75 transition hover:opacity-100'>
            <Image
              src='https://rb.gy/vsvv2o'
              layout='fill'
              objectFit='contain'
              alt={''}
            />
          </div>
        </Link>
      </div>
      <div className='hidden flex-1 items-center justify-center space-x-8 md:flex'>
        {HEADER.map((header, index) => (
          <div key={index} className='headerLink'>
            {header.header}
          </div>
        ))}
      </div>
      <div className='flex items-center justify-center gap-x-4 pr-5 md:w-1/5 md:pr-0'>
        <MagnifyingGlassIcon className='headerIcon' />
        <Link href='/checkout'>
          <div className='relative cursor-pointer'>
            {items.length > 0 && (
              <span className='gradient absolute -right-1 -top-1 z-50 flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white'>
                {items.length}
              </span>
            )}
            <ShoppingBagIcon className='headerIcon' />
          </div>
        </Link>
        {session ? (
          <Image
            src={session.user?.image || '/assets/profile.jpeg'}
            alt=''
            className='cursor-pointer rounded-full'
            width={34}
            height={34}
            onClick={() => signOut()}
          />
        ) : (
          <UserIcon className='headerIcon' onClick={() => signIn()} />
        )}
      </div>
    </header>
  );
}

export default Header;
