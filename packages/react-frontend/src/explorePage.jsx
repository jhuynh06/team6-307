import React, { useState, useEffect } from "react";
import { 
  Box, 
  Title, 
  Skeleton, 
  Container, 
  ActionIcon 
} from "@mantine/core";
import ProductCard from "./ProductCard"; 
import "./explorepage.css"; 

const mockProducts = [
  { _id: "1", name: "Food Name 1", category: "Snacks", inStock: true },
  { _id: "2", name: "Food Name 2", category: "Drinks", inStock: true },
  { _id: "3", name: "Food Name 3", category: "Meals", inStock: false },
  { _id: "4", name: "Food Name 4", category: "Snacks", inStock: true },
  { _id: "5", name: "Food Name 5", category: "Drinks", inStock: false },
  { _id: "6", name: "Food Name 6", category: "Meals", inStock: true },
  { _id: "7", name: "Food Name 7", category: "Meals", inStock: true },
  { _id: "8", name: "Food Name 8", category: "Snacks", inStock: true },
  { _id: "9", name: "Food Name 9", category: "Drinks", inStock: true },
];

const CarouselSection = ({ title, products, loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3;
  const safeProducts = products || [];
  const totalItems = safeProducts.length;

  const handleNext = () => {
    // If scrolling past the end, loop to 0
    if (currentIndex + itemsToShow >= totalItems) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + itemsToShow);
    }
  };

  const handlePrev = () => {
    // If at the start, loop to the end
    if (currentIndex === 0) {
      // Find the start index of the last full "page"
      const remainder = totalItems % itemsToShow;
      const lastPageStart = remainder === 0 ? totalItems - itemsToShow : totalItems - remainder;
      setCurrentIndex(lastPageStart);
    } else {
      setCurrentIndex(Math.max(0, currentIndex - itemsToShow));
    }
  };

  return (
    <Box mb={50}>
      <Title order={3} mb="md">{title}</Title>

      <div className="carousel-container">
        {/* Left Arrow: Transparent variant to look like original */}
        <ActionIcon 
          className="carousel-arrow arrow-left" 
          variant="transparent" 
          size="xl" 
          onClick={handlePrev}
        >
          ◀
        </ActionIcon>

        <div className="carousel-viewport">
          {loading ? (
            <div className="carousel-track">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="carousel-card-wrapper">
                    <Skeleton height={200} radius="md" width="100%" />
                </div>
              ))}
            </div>
          ) : (
            <div 
                className="carousel-track" 
                style={{ 
                    transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` 
                }}
            >
              {safeProducts.map((product) => (
                <div key={product._id} className="carousel-card-wrapper">
                    <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Arrow */}
        <ActionIcon 
          className="carousel-arrow arrow-right" 
          variant="transparent" 
          size="xl" 
          onClick={handleNext}
        >
          ▶
        </ActionIcon>
      </div>
    </Box>
  );
};

const Explore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/products")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(mockProducts);
        }
        setLoading(false);
      })
      .catch(() => {
        setProducts(mockProducts);
        setLoading(false);
      });
  }, []);

  return (
    <Container size="xl" py="xl">
      <CarouselSection title="Most Popular" products={products} loading={loading} />
      <CarouselSection title="Highly Rated" products={[...products].reverse()} loading={loading} />
      <CarouselSection title="New Arrivals" products={products} loading={loading} />
    </Container>
  );
};

export default Explore;