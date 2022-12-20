import React, { useEffect, useState } from 'react';
import { urlFor } from '../sanity';
import Image from 'next/image';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { addToBasket, selectBasketItems } from '../redux/basketSlice';
import toast from 'react-hot-toast';
import Currency from 'react-currency-formatter';
import { useSelector } from 'react-redux';

interface Props {
  product: Product;
}

function Product({ product }: Props) {
  const dispatch = useDispatch();
  const items = useSelector(selectBasketItems);

  const [groupedItemsInBasket, setGroupedItemsInBasket] = useState(
    {} as { [key: string]: Product[] }
  );

  function addItemToBasket() {
    dispatch(addToBasket(product));

    toast.success(`${product.title} added to basket`, {
      position: 'bottom-center',
    });
  }

  useEffect(() => {
    const groupedItems = items.reduce((results, item) => {
      (results[item._id] = results[item._id] || []).push(item);
      return results;
    }, {} as { [key: string]: Product[] });

    setGroupedItemsInBasket(groupedItems);
  }, [items]);

  return (
    <div className='flex h-fit w-[320px] select-none flex-col space-y-3 rounded-xl bg-[#35383c] p-3 md:h-[500px] md:w-[400px] md:p-7'>
      <div className='relative h-64 w-full md:h-72'>
        <Image
          src={urlFor(product.image[0]).url()}
          layout='fill'
          objectFit='contain'
          alt=''
        />
      </div>
      <div className='flex items-center justify-between space-x-3'>
        <div className='text-lg text-white md:text-xl'>
          <p className='mb-3'>{product.title}</p>
          <Currency quantity={product.price} currency='USD' />
        </div>
        <div
          className='flex-shrink-8 gradient relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full md:h-[60px] md:w-[60px]'
          onClick={addItemToBasket}
        >
          <ShoppingCartIcon className='h-8 w-8 text-white' />
          {Object.entries(groupedItemsInBasket).map(
            ([key, items]) =>
              product._id === key && (
                <span
                  key={key}
                  className='gradient absolute -right-2 -top-2 z-50 flex h-7 w-7 items-center justify-center rounded-full text-[10px] text-white'
                >
                  {items.length}
                </span>
              )
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;
