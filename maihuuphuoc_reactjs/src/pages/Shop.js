import React from 'react'
import Footer from '../components/footer';
import Header from '../components/header';

function Shop() {
    return (
        <div>
            <Header />
            <section id="shop">
                <div className="container mx-auto">
                    {/* Top Filter */}
                    <div className="flex flex-col md:flex-row justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <button className="bg-primary text-white hover:bg-transparent hover:text-primary border hover:border-primary py-2 px-4 rounded-full focus:outline-none">Show On Sale</button>
                            <button className="bg-primary text-white hover:bg-transparent hover:text-primary border hover:border-primary py-2 px-4 rounded-full focus:outline-none">List View</button>
                            <button className="bg-primary text-white hover:bg-transparent hover:text-primary border hover:border-primary py-2 px-4 rounded-full focus:outline-none">Grid View</button>
                        </div>
                        <div className="flex mt-5 md:mt-0 space-x-4">
                            <div className="relative">
                                <select className="block appearance-none w-full bg-white border hover:border-primary px-4 py-2 pr-8 rounded-full shadow leading-tight focus:outline-none focus:shadow-outline">
                                    <option>Sort by Latest</option>
                                    <option>Sort by Popularity</option>
                                    <option>Sort by A-Z</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center px-2">
                                    <img id="arrow-down" className="h-4 w-4" src="/assets/images/filter-down-arrow.svg" alt="filter arrow" />
                                    <img id="arrow-up" className="h-4 w-4 hidden" src="/assets/images/filter-up-arrow.svg" alt="filter arrow" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Filter Toggle Button for Mobile */}
                    <div className="block md:hidden text-center mb-4">
                        <button id="products-toggle-filters" className="bg-primary text-white py-2 px-4 rounded-full focus:outline-none">Show Filters</button>
                    </div>
                    <div className="flex flex-col md:flex-row">
                        {/* Filters */}
                        <div id="filters" className="w-full md:w-1/4 p-4 hidden md:block">
                            {/* Category Filter */}
                            <div className="mb-6 pb-8 border-b border-gray-line">
                                <h3 className="text-lg font-semibold mb-6">Category</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="form-checkbox custom-checkbox" />
                                        <span className="ml-2">T-Shirts</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="form-checkbox custom-checkbox" />
                                        <span className="ml-2">Hoodies</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="form-checkbox custom-checkbox" />
                                        <span className="ml-2">Accessories</span>
                                    </label>
                                </div>
                            </div>
                            {/* Size Filter */}
                            <div className="mb-6 pb-8 border-b border-gray-line">
                                <h3 className="text-lg font-semibold mb-6">Size</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="form-checkbox custom-checkbox" />
                                        <span className="ml-2">S (30)</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="form-checkbox custom-checkbox" />
                                        <span className="ml-2">M (44)</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="form-checkbox custom-checkbox" />
                                        <span className="ml-2">L (22)</span>
                                    </label>
                                </div>
                            </div>
                            {/* Color Filter */}
                            <div className="mb-6 pb-8 border-b border-gray-line">
                                <h3 className="text-lg font-semibold mb-6">Color</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center custom-color-checkbox" data-color="#ff0000">
                                        <input type="checkbox" className="form-checkbox custom-checkbox" />
                                        <span className="ml-2">Red</span>
                                    </label>
                                    <label className="flex items-center custom-color-checkbox" data-color="#0000ff">
                                        <input type="checkbox" className="form-checkbox custom-checkbox" />
                                        <span className="ml-2">Blue</span>
                                    </label>
                                    <label className="flex items-center custom-color-checkbox" data-color="#00ff00">
                                        <input type="checkbox" className="form-checkbox custom-checkbox" />
                                        <span className="ml-2">Green</span>
                                    </label>
                                </div>
                            </div>
                            {/* Brand Filter */}
                            <div className="mb-6 pb-8 border-b border-gray-line">
                                <h3 className="text-lg font-semibold mb-6">Brand</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="form-checkbox custom-checkbox" />
                                        <span className="ml-2">Nike</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="form-checkbox custom-checkbox" />
                                        <span className="ml-2">Adidas</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="form-checkbox custom-checkbox" />
                                        <span className="ml-2">Puma</span>
                                    </label>
                                </div>
                            </div>
                            {/* Rating Filter */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-6">Rating</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="form-checkbox custom-checkbox" />
                                        <span className="ml-2">★★★★★</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="form-checkbox custom-checkbox" />
                                        <span className="ml-2">★★★★☆</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="form-checkbox custom-checkbox" />
                                        <span className="ml-2">★★★☆☆</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {/* Products List */}
                        <div className="w-full md:w-3/4 p-4">
                            {/* Products grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Product 1 */}
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <img src="assets/images/products/5.jpg" alt="Product 1" className="w-full object-cover mb-4 rounded-lg" />
                                    <a href="#" className="text-lg font-semibold mb-2">Blue women's suit</a>
                                    <p className="my-2">Women</p>
                                    <div className="flex items-center mb-4">
                                        <span className="text-lg font-bold text-primary">$19.99</span>
                                        <span className="text-sm line-through ml-2">$24.99</span>
                                    </div>
                                    <button className="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">Add to Cart</button>
                                </div>
                                {/* Product 2 */}
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <img src="assets/images/products/6.jpg" alt="Product 2" className="w-full object-cover mb-4 rounded-lg" />
                                    <a href="#" className="text-lg font-semibold mb-2">Stylish Hoodie</a>
                                    <p className="my-2">Unisex</p>
                                    <div className="flex items-center mb-4">
                                        <span className="text-lg font-bold text-primary">$29.99</span>
                                        <span className="text-sm line-through ml-2">$34.99</span>
                                    </div>
                                    <button className="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">Add to Cart</button>
                                </div>
                                {/* Product 3 */}
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <img src="assets/images/products/7.jpg" alt="Product 3" className="w-full object-cover mb-4 rounded-lg" />
                                    <a href="#" className="text-lg font-semibold mb-2">Casual T-Shirt</a>
                                    <p className="my-2">Men</p>
                                    <div className="flex items-center mb-4">
                                        <span className="text-lg font-bold text-primary">$15.99</span>
                                        <span className="text-sm line-through ml-2">$19.99</span>
                                    </div>
                                    <button className="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">Add to Cart</button>
                                </div>
                                {/* Product 4 */}
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <img src="assets/images/products/8.jpg" alt="Product 4" className="w-full object-cover mb-4 rounded-lg" />
                                    <a href="#" className="text-lg font-semibold mb-2">Classic Black Tee</a>
                                    <p className="my-2">Men</p>
                                    <div className="flex items-center mb-4">
                                        <span className="text-lg font-bold text-primary">$12.99</span>
                                        <span className="text-sm line-through ml-2">$15.99</span>
                                    </div>
                                    <button className="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">Add to Cart</button>
                                </div>
                                
                            </div>
                            
                        </div>
                        
                    </div>
                    {/* Shop Category Description */}
                    <section id="shop-category-description" className="py-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">Shirts Category</h2>
                            <p className="mb-4">
                                Discover our wide range of shirts, perfect for any occasion. Whether you're looking for something
                                casual or formal, we have the perfect shirt for you. Our collection includes a variety of styles, colors,
                                and sizes to suit everyone's taste.
                            </p>
                            <p>
                                Browse through our selection and find your new favorite shirt today. All our shirts are made from
                                high-quality materials and are designed to provide both comfort and style. Shop now and elevate your
                                wardrobe with our premium shirts.
                            </p>
                        </div>
                    </section>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default Shop;
