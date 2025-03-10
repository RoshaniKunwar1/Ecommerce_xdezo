import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext.jsx';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import CartTotal from '../Components/CartTotal.jsx';
import { useUser } from '@clerk/clerk-react';

const Cart = () => {
	const { user } = useUser();
	const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
	const [cartData, setCartData] = useState([]);



	useEffect(() => {
		const tempData = [];
		for (const items in cartItems) {
			for (const item in cartItems[items]) {
				if (cartItems[items][item] > 0) {
					tempData.push({
						_id: items,
						size: item,
						quantity: cartItems[items][item],
					});
				}
			}
		}
		setCartData(tempData);
	}, [cartItems]);

	// Check if cart is empty
	const isCartEmpty = cartData.length === 0;

	return user ? (
		<div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
			<div className='border-b border-gray-300 pt-14'>
				<div className='text-2xl mb-3'>
					<h1 className='text-gray-600 text-center font-semibold'>
						Your <span className='text-black'>Cart</span>
					</h1>
				</div>

				{/* Cart Items */}
				<div>
					{cartData.map((item, index) => {
						const productData = products.find((product) => product._id === item._id);
						return (
							<div
								key={index}
								className='py-4 border-gray-300 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 hover:bg-gray-50 transition-all duration-200'
							>
								<div className='flex items-start gap-6'>
									<img
										src={productData.image[0]}
										className='w-16 sm:w-20 rounded-md'
										alt={productData.name}
									/>
									<div>
										<p className='text-sm sm:text-lg font-semibold text-gray-800'>{productData.name}</p>
										<div className='flex items-center mt-2'>
											<p className='text-base font-medium'>
												{currency}
												{productData.price}
											</p>
											<p className='px-2 sm:px-3 sm:py-1 border border-gray-300 bg-slate-100 mx-2 rounded-md'>
												{item.size}
											</p>
										</div>
									</div>
								</div>
								<input
									onChange={(e) =>
										e.target.value === '' || e.target.value === '0'
											? null
											: updateQuantity(item._id, item.size, Number(e.target.value))
									}
									className='border border-gray-300 rounded-md max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 text-center transition-all duration-200 focus:ring-2 focus:ring-blue-400'
									type='number'
									min={1}
									defaultValue={item.quantity}
								/>
								<RiDeleteBin7Fill
									onClick={() => {
										updateQuantity(item._id, item.size, 0);
									}}
									className='w-5 h-5 mr-4 sm:w-5 cursor-pointer hover:text-red-600 transition-all duration-200'
								/>
							</div>
						);
					})}
				</div>

				{/* Checkout Section */}
				<div className='flex justify-end my-10'>
					<div className='w-full sm:w-[450px]'>
						<CartTotal />
						<div className='w-full text-end'>
							<button
								onClick={()=>navigate('/place-order')}
								className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm my-8 px-8 py-3 rounded-md hover:scale-105 transform transition-all duration-200 ${isCartEmpty ? 'opacity-50 cursor-not-allowed' : ''}`}
								disabled={isCartEmpty}
							>
								PROCEED TO CHECKOUT
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div className='text-center text-gray-600'>Please log in to view your cart.</div>
	);
};

export default Cart;