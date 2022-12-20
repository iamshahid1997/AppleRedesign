import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { getCategories } from '../utils/fetchCategories';
import { getProducts } from '../utils/fetchProducts';
import Product from './Product';
import Lottie from 'lottie-react';
import loadingAnimation from '../public/assets/loadingAnimation.json';

function Tabs() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    getCategories(setCategories);
    getProducts(setProducts);
  }, []);

  function showProducts(category: number) {
    return categories && products && products
      .filter(
        (product: Product) => product.category._ref === categories[category]?._id
      )
      .map((product: Product) => (
        <Product key={product._id} product={product} />
      ));
  }

  return (
    <Tab.Group>
      <Tab.List className='flex justify-center'>
        {categories.map((category: Category, index: number) => (
          <Tab
            key={category._id}
            id={category._id}
            className={`${
              selected === index
                ? 'borderGradient bg-[#35383c] text-white'
                : 'border-b-2 border-[#35383c] text-[#747474]'
            } whitespace-nowrap rounded-t-lg py-3 px-5 text-sm font-light outline-none transition-all md:py-4 md:px-6 md:text-base`}
            onClick={() => setSelected(index)}
          >
            {category.title}
          </Tab>
        ))}
      </Tab.List>
      {products.length > 0 ? (
        <Tab.Panels className='mx-auto max-w-fit pt-10 pb-24 sm:px-4'>
          <Tab.Panel className='tabPanel'>{showProducts(0)}</Tab.Panel>
          <Tab.Panel className='tabPanel'>{showProducts(1)}</Tab.Panel>
          <Tab.Panel className='tabPanel'>{showProducts(2)}</Tab.Panel>
          <Tab.Panel className='tabPanel'>{showProducts(3)}</Tab.Panel>
        </Tab.Panels>
      ) : (
        <div className='w-full flex justify-center '>
          <Lottie animationData={loadingAnimation} loop={true} className='h-24 w-24 '/>
        </div>
      )}
    </Tab.Group>
  );
}

export default Tabs;
