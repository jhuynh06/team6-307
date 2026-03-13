import { useState, useEffect } from "react";
import { Box, Title, Skeleton, Container, ActionIcon } from "@mantine/core";
import ProductCard from "./ProductCard";
import "./explorePage.css";
import { API_PREFIX } from "./config";

const CarouselSection = ({ title, products, loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3;
  const safeProducts = products || [];
  const totalItems = safeProducts.length;

  const handleNext = () => {
    if (currentIndex + itemsToShow >= totalItems) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + itemsToShow);
    }
  };

  const handlePrev = () => {
    if (currentIndex === 0) {
      const remainder = totalItems % itemsToShow;
      const lastPageStart =
        remainder === 0 ? totalItems - itemsToShow : totalItems - remainder;
      setCurrentIndex(lastPageStart);
    } else {
      setCurrentIndex(Math.max(0, currentIndex - itemsToShow));
    }
  };

  return (
    <Box mb={50}>
      <Title order={3} mb="md">
        {title}
      </Title>

      <div className="carousel-container">
        <ActionIcon
          className="carousel-arrow arrow-left"
          variant="transparent"
          size="xl"
          onClick={handlePrev}>
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
              }}>
              {safeProducts.map((product) => (
                <div key={product._id} className="carousel-card-wrapper">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        <ActionIcon
          className="carousel-arrow arrow-right"
          variant="transparent"
          size="xl"
          onClick={handleNext}>
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
    fetch(`${API_PREFIX}/stores`)
      .then((res) => res.json())
      .then((stores) => {
        // Fetch each store's products and flatten
        return Promise.all(
          stores.map((s) =>
            fetch(`${API_PREFIX}/stores/${s._id}/products`)
              .then((res) => res.json())
              .then((prods) =>
                prods.map((p) => ({ ...p, storeId: s._id }))
              )
          )
        );
      })
      .then((nested) => {
        setProducts(nested.flat());
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  return (
    <Container size="xl" py="xl">
      <CarouselSection
        title="Most Popular"
        products={products}
        loading={loading}
      />
      <CarouselSection
        title="Highly Rated"
        products={[...products].reverse()}
        loading={loading}
      />
      <CarouselSection
        title="New Arrivals"
        products={products}
        loading={loading}
      />
    </Container>
  );
};

export default Explore;
