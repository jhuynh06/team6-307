import { Card, Box, Text, Image } from "@mantine/core";

function ProductCard({ product }) {
  const { name, cardImage } = product;

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      <Card.Section>
        {cardImage ? (
          <Image
            src={cardImage}
            alt={name}
            style={{ aspectRatio: "4 / 3", objectFit: "cover" }}
          />
        ) : (
          <Box
            style={{
              backgroundColor: "#DCE775",
              aspectRatio: "4 / 3",
              width: "100%"
            }}
          />
        )}
      </Card.Section>
      <Text mt="xs" size="sm" fw={600} c="#222">
        {name}
      </Text>
    </Card>
  );
}

export default ProductCard;
