import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useSelector } from 'react-redux';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import Stripe from 'stripe';
import Button from '../components/Button';
import { selectBasketItems, selectBasketTotal } from '../redux/basketSlice';
import CheckoutProduct from '../components/CheckoutProduct';
import Currency from 'react-currency-formatter';
import { fetchPostJSON } from '../utils/api-helpers';
import getStripe from '../utils/get-stripejs';

function Checkout() {
  const items = useSelector(selectBasketItems);
  const basketTotal = useSelector(selectBasketTotal);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [groupedItemsInBasket, setGroupedItemsInBasket] = useState(
    {} as { [key: string]: Product[] }
  );

  useEffect(() => {
    const groupedItems = items.reduce((results, item) => {
      (results[item._id] = results[item._id] || []).push(item);
      return results;
    }, {} as { [key: string]: Product[] });

    setGroupedItemsInBasket(groupedItems);
  }, [items]);

  async function createCheckoutSession() {
    setLoading(true);

    const checkoutSession: Stripe.Checkout.Session = await fetchPostJSON(
      '/api/checkout_sessions',
      {
        items: items,
      }
    );

    console.log(checkoutSession)
    //Internal Server Error
    if ((checkoutSession as any).statusCode === 500) {
      console.error((checkoutSession as any).message);
      return;
    }

    // Redirect to checkout
    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      sessionId: checkoutSession.id,
    });
    console.warn(error.message);

    setLoading(false);
  }

  return (
    <div className='min-h-screen overflow-hidden bg-background'>
      <Head>
        <title>Bag - Apple</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <main className='mx-auto max-w-5xl pb-24'>
        <div className='flex flex-col items-center px-5'>
          <h1 className='my-4 text-3xl font-semibold lg:text-4xl'>
            {items.length > 0 ? 'Review your bag.' : 'Your bag is empty'}
          </h1>
          <p className='my-4'>Free Delivery and Free returns.</p>
          {items.length === 0 && (
            <Button
              title='Continue Shopping'
              onClick={() => router.push('/')}
            />
          )}
        </div>
        {items.length > 0 && (
          <div className='mx-5 md:mx-8'>
            {Object.entries(groupedItemsInBasket).map(([key, items]) => (
              <CheckoutProduct key={key} items={items} id={key} />
            ))}
            <div className='mx-w-3xl my-12 mt-6 ml-auto divide-y divide-gray-300'>
              <div className='divide-y divide-gray-300'>
                <div className='pb-4'>
                  <div className='flex justify-between'>
                    <p>SubTotal</p>
                    <p>
                      <Currency quantity={basketTotal} currency='INR' />
                    </p>
                  </div>
                  <div className='flex justify-between'>
                    <p>Shipping</p>
                    <p>FREE</p>
                  </div>
                </div>
              </div>
              <div className='flex justify-between pt-4 text-xl font-semibold'>
                <h4>Total</h4>
                <h4>
                  <Currency quantity={basketTotal} currency='INR' />
                </h4>
              </div>
            </div>
            <div className='my-14 space-y-4'>
              <h4 className='text-xl font-semibold'>
                How would you like to checkout?
              </h4>
              <div className='flex flex-col gap-4 md:flex-row'>
                <div className='flex flex-1 flex-col items-center rounded-xl bg-gray-200 p-8 py-12 text-center md:order-2'>
                  <h4 className='mb-4 flex flex-col text-xl font-semibold'>
                    Pay in full
                    <span>
                      <Currency quantity={basketTotal} currency='USD' />
                    </span>
                  </h4>
                  <Button
                    noIcon
                    loading={loading}
                    title='Check Out'
                    width='w-full'
                    onClick={createCheckoutSession}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Checkout;
