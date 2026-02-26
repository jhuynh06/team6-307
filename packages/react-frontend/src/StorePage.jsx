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
  Accordion
} from "@mantine/core";
import ProductCard from "./ProductCard";
import "./StorePage.css";

const BANNER =
  "https://ssgse.com/ssg/wp-content/uploads/SSG-CalPoly-CampusMktUU-2-1024x563.jpg";

const mockProducts = [
  { _id: "1", name: "Food Name 1", category: "Snacks", inStock: true },
  { _id: "2", name: "Food Name 2", category: "Drinks", inStock: true },
  { _id: "3", name: "Food Name 3", category: "Meals", inStock: false },
  { _id: "4", name: "Food Name 4", category: "Snacks", inStock: true },
  { _id: "5", name: "Food Name 5", category: "Drinks", inStock: false },
  { _id: "6", name: "Food Name 6", category: "Meals", inStock: true }
];

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
        className="filter-accordion"
      >
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
                  onChange({ ...filters, inStock: e.currentTarget.checked })
                }
              />
              <Checkbox
                label="Out of Stock"
                checked={filters.outOfStock}
                onChange={(e) =>
                  onChange({ ...filters, outOfStock: e.currentTarget.checked })
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    foodTypes: [],
    inStock: false,
    outOfStock: false
  });

  useEffect(() => {
    fetch("http://localhost:8000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setProducts(mockProducts);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter((p) => {
    const typeMatch =
      filters.foodTypes.length === 0 ||
      filters.foodTypes.includes(p.category);
    const availMatch =
      !filters.inStock && !filters.outOfStock
        ? true
        : (filters.inStock && p.inStock) ||
          (filters.outOfStock && !p.inStock);
    return typeMatch && availMatch;
  });

  return (
    <Box className="store-page-container">
      <Box className="hero-banner" style={{ backgroundImage: `url(${BANNER})` }}>
        <Box className="hero-overlay" />
        <Group align="center" gap="md" className="hero-content">
          <Avatar size={80} radius="xl" className="store-avatar" />
          <Stack gap={4}>
            <Title order={1} c="white" style={{ fontSize: 32 }}>
              Campus Market
            </Title>
            <Group gap={8}>
              <Rating value={4} readOnly size="sm" />
              <Text size="sm" c="rgba(255,255,255,0.8)">
                (128 reviews)
              </Text>
            </Group>
            <Group gap={10} mt={4}>
              <Box
                style={{
                  backgroundColor: "var(--mantine-color-green-5)",
                  padding: "2px 8px",
                  borderRadius: "var(--mantine-radius-sm)"
                }}
              >
                <Text size="xs" fw={700} c="white" tt="uppercase">
                  Open
                </Text>
              </Box>
              <Text size="sm" c="white" fw={500}>
                10:00 AM - 11:00 PM
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
            ) : filtered.length === 0 ? (
              <Paper p="xl" withBorder style={{ textAlign: "center" }}>
                <Text size="lg" c="dimmed">
                  No products match your filters.
                </Text>
              </Paper>
            ) : (
              <SimpleGrid cols={3} spacing="lg">
                {filtered.map((product) => (
                  <ProductCard key={product._id} product={product} />
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