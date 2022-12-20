import { PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import React, { useState } from 'react';
import { urlFor } from '../sanity';
import Currency from 'react-currency-formatter';
import { removeFromBasket, addToBasket } from '../redux/basketSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

interface Props {
  items: Product[];
  id: string;
}

function CheckoutProduct({ id, items }: Props) {
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const dispatch = useDispatch();
  function removeItemfromBasket() {
    dispatch(removeFromBasket({ id }));

    toast.error(`${items[0].title} removed from basket`, {
      position: 'bottom-center',
    });
  }

  function addItemToBasket() {
    dispatch(addToBasket(items[0]));

    toast.success(`${items[0].title} added to basket`, {
      position: 'bottom-center',
    });
  }
  console.log(items[0].description);

  return (
    <div className='flex flex-col gap-x-4 border-b border-gray-300 pb-5 lg:flex-row lg:items-center'>
      <div className='relative h-44 w-44'>
        <Image
          src={urlFor(items[0].image[0]).url()}
          alt=''
          layout='fill'
          objectFit='contain'
        />
      </div>
      <div className='flex flex-1 items-end lg:items-center'>
        <div className='flex-1 space-y-4'>
          <div className='flex flex-col gap-x-8 text-xl lg:flex-row lg:text-2xl'>
            <h4 className='font-semibold lg:w-96'>{items[0].title}</h4>
            <p className='flex items-center gap-x-1 font-semibold'>
              {items.length}
              <span
                className='ml-3 flex cursor-pointer text-sm'
                onClick={addItemToBasket}
              >
                <PlusIcon className='h-5 w-5 text-blue-500' />
              </span>
            </p>
          </div>
          <p
            className='flex cursor-pointer items-center text-blue-500 hover:underline'
            onClick={() => setShowDescription((prev) => !prev)}
          >
            Show product details
            <ChevronDownIcon className='ml-3 h-5 w-5' />
          </p>
          {showDescription && (
            <p className='pr-3 text-gray-600'>
              {`${items[0].description.substring(0, 50)}...`}
            </p>
          )}
        </div>
        <div className='spcae-y-4 flex flex-col items-end'>
          <h4 className='text-xl font-semibold lg:text-2xl'>
            <Currency
              quantity={items.reduce((total, item) => total + item.price, 0)}
              currency='INR'
            />
          </h4>
          <button
            onClick={removeItemfromBasket}
            className='text-blue-500 hover:underline'
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutProduct;
