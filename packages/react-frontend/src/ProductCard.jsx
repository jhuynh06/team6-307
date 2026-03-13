import { Card, Box, Text, Image } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const { name, cardImage, image, _id, storeId } = product;
  const imgSrc = cardImage || image;
  const navigate = useNavigate();

  const handleClick = () => {
    if (storeId && _id) {
      navigate(`/stores/${storeId}/product/${_id}`);
    }
  };

  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="md"
      withBorder
      onClick={handleClick}
      style={{ cursor: storeId && _id ? "pointer" : "default" }}
    >
      <Card.Section>
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={name}
            style={{ aspectRatio: "4 / 3", objectFit: "cover" }}
          />
        ) : (
          <Box
            style={{
              backgroundColor: "#4caf50",
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
