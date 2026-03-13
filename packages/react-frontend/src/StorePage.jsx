import { useState, useEffect } from "react";
import {
  Box,
  Group,
  Stack,
  Title,
  Text,
  Rating,
  SimpleGrid,
  Avatar,
  Skeleton,
  Paper,
  Checkbox,
  Accordion,
  Loader
} from "@mantine/core";
import { Link, useParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import "./StorePage.css";
import { API_PREFIX } from "./config";

const FOOD_TYPES = ["Snacks", "Drinks", "Meals"];

function FilterSidebar({ filters, onChange }) {
  function toggleFoodType(type) {
    const updated = filters.foodTypes.includes(type)
      ? filters.foodTypes.filter((t) => t !== type)
      : [...filters.foodTypes, type];
    onChange({ ...filters, foodTypes: updated });
  }

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <Title order={4} className="filter-title">
          Filters
        </Title>
      </div>

      <Accordion
        multiple
        defaultValue={["category", "availability"]}
        chevronPosition="left"
        className="filter-accordion">
        <Accordion.Item value="category">
          <Accordion.Control>Category</Accordion.Control>
          <Accordion.Panel>
            <Stack gap={6}>
              {FOOD_TYPES.map((type) => (
                <Checkbox
                  key={type}
                  label={type}
                  checked={filters.foodTypes.includes(type)}
                  onChange={() => toggleFoodType(type)}
                />
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="availability">
          <Accordion.Control>Availability</Accordion.Control>
          <Accordion.Panel>
            <Stack gap={6}>
              <Checkbox
                label="In Stock"
                checked={filters.inStock}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    inStock: e.currentTarget.checked
                  })
                }
              />
              <Checkbox
                label="Out of Stock"
                checked={filters.outOfStock}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    outOfStock: e.currentTarget.checked
                  })
                }
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="allergies">
          <Accordion.Control>Allergies</Accordion.Control>
          <Accordion.Panel>
            <Text size="sm" c="dimmed" fs="italic">
              No filters available
            </Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="rating">
          <Accordion.Control>Rating</Accordion.Control>
          <Accordion.Panel>
            <Text size="sm" c="dimmed" fs="italic">
              No filters available
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

function StorePage() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [storeLoading, setStoreLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    foodTypes: [],
    inStock: false,
    outOfStock: false
  });

  useEffect(() => {
    fetch(`${API_PREFIX}/stores/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Store not found");
        return res.json();
      })
      .then((data) => {
        setStore(data);
        setStoreLoading(false);
      })
      .catch((err) => {
        console.error("Store fetch error:", err);
        setStoreLoading(false);
      });

    const token = localStorage.getItem("token") || "";
    fetch(`${API_PREFIX}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Could not load products. Please try again later.");
        setLoading(false);
      });
  }, [id]);

  const filtered = products.filter((p) => {
    const typeMatch =
      filters.foodTypes.length === 0 || filters.foodTypes.includes(p.category);
    const availMatch =
      !filters.inStock && !filters.outOfStock
        ? true
        : (filters.inStock && p.inStock) || (filters.outOfStock && !p.inStock);
    return typeMatch && availMatch;
  });

  if (storeLoading) {
    return (
      <Box ta="center" mt={60}>
        <Loader size="xl" />
      </Box>
    );
  }

  if (!store) {
    return (
      <Box ta="center" mt={60}>
        <Title order={2}>Store not found</Title>
      </Box>
    );
  }

  return (
    <Box className="store-page-container">
      <Box
        className="hero-banner"
        style={{
          backgroundImage: store.bannerImage
            ? `url(${store.bannerImage})`
            : undefined,
          backgroundColor: store.bannerImage ? undefined : "#4caf50"
        }}>
        <Box className="hero-overlay" />
        <Group align="center" gap="md" className="hero-content">
          <Avatar
            size={80}
            radius="xl"
            className="store-avatar"
            src={store.profileImage || null}
          />
          <Stack gap={4}>
            <Title order={1} c="white" style={{ fontSize: 32 }}>
              {store.name}
            </Title>
            <Group gap={8}>
              <Rating value={store.rating} readOnly size="sm" />
              <Text size="sm" c="rgba(255,255,255,0.8)">
                ({store.reviewCount} reviews)
              </Text>
            </Group>
            <Group gap={10} mt={4}>
              <Box
                style={{
                  backgroundColor: store.isOpen
                    ? "var(--mantine-color-green-5)"
                    : "var(--mantine-color-red-5)",
                  padding: "2px 8px",
                  borderRadius: "var(--mantine-radius-sm)"
                }}>
                <Text size="xs" fw={700} c="white" tt="uppercase">
                  {store.isOpen ? "Open" : "Closed"}
                </Text>
              </Box>
              <Text size="sm" c="white" fw={500}>
                {store.hours}
              </Text>
            </Group>
          </Stack>
        </Group>
      </Box>

      <Box className="main-content">
        <Group align="flex-start" gap={32}>
          <FilterSidebar filters={filters} onChange={setFilters} />
          <Box style={{ flex: 1 }}>
            {loading ? (
              <SimpleGrid cols={3} spacing="lg">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} height={260} radius="md" />
                  ))}
              </SimpleGrid>
            ) : error ? (
              <Paper p="xl" withBorder style={{ textAlign: "center" }}>
                <Text size="lg" c="red">
                  {error}
                </Text>
              </Paper>
            ) : filtered.length === 0 ? (
              <Paper p="xl" withBorder style={{ textAlign: "center" }}>
                <Text size="lg" c="dimmed">
                  No products match your filters.
                </Text>
              </Paper>
            ) : (
              <SimpleGrid cols={3} spacing="lg">
                {filtered.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    style={{ textDecoration: "none" }}>
                    <ProductCard product={product} />
                  </Link>
                ))}
              </SimpleGrid>
            )}
          </Box>
        </Group>
      </Box>
    </Box>
  );
}

export default StorePage;
