import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Button,
  Paper,
  Group,
  Rating,
  Textarea,
  Stack,
  Divider,
  Loader
} from "@mantine/core";

// Switch to azure when pr merges
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://polyratemyfood-ezfxgaf9dcgpdkga.eastus-01.azurewebsites.net";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newRating, setNewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");

  // 1. Fetch from Database using dynamic API_URL
  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProductData(data);
        setReviews(data.reviews || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setProductData(null);
        setIsLoading(false);
      });
  }, [id]);

  // 2. Submit Review using dynamic API_URL
  const handleSubmitReview = async () => {
    if (newRating === 0) {
      alert("Please select a star rating first!");
      return;
    }

    const newReview = {
      user: "Guest User",
      text: newReviewText,
      rating: newRating
    };

    setReviews([newReview, ...reviews]);
    setNewRating(0);
    setNewReviewText("");

    try {
      await fetch(`${API_URL}/products/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview)
      });
    } catch (error) {
      console.error(error);
    }
  };

  // ... (Rest of your component remains the same)
  if (isLoading)
    return (
      <Container size="sm" mt={60} ta="center">
        <Loader size="xl" />
      </Container>
    );

  if (!productData) {
    return (
      <Container size="sm" mt={60} ta="center">
        <Paper p="xl" withBorder shadow="sm">
          <Title order={2} mb="md">
            No details available
          </Title>
          <Text c="dimmed" mb="xl">
            This dish has no reviews yet.
          </Text>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="md" mt={40} pb={60}>
      <Button
        variant="subtle"
        onClick={() => navigate(-1)}
        mb="md">
        &larr; Back to Store
      </Button>
      <Title>{productData.name}</Title>
      <Text size="lg" c="dimmed" mb="xl">
        {productData.description}
      </Text>
      <Divider my="xl" />
      <Paper
        withBorder
        p="md"
        mb="xl"
        bg="var(--mantine-color-gray-0)">
        <Title order={4} mb="sm">
          Leave a Review
        </Title>
        <Stack gap="sm">
          <Group>
            <Text fw={500}>Your Rating:</Text>
            <Rating
              value={newRating}
              onChange={setNewRating}
              size="lg"
            />
          </Group>
          <Textarea
            placeholder="What did you think?"
            value={newReviewText}
            onChange={(e) =>
              setNewReviewText(e.currentTarget.value)
            }
            minRows={3}
          />
          <Button
            onClick={handleSubmitReview}
            style={{ alignSelf: "flex-start" }}>
            Submit Review
          </Button>
        </Stack>
      </Paper>
      <Title order={3} mb="md">
        Reviews ({reviews.length})
      </Title>
      {reviews.length === 0 ? (
        <Text c="dimmed">No reviews yet.</Text>
      ) : (
        reviews.map((r, i) => (
          <Paper key={i} withBorder p="md" mb="sm">
            <Group justify="space-between" mb="xs">
              <Text fw={700}>{r.user}</Text>
              <Rating value={r.rating} readOnly size="sm" />
            </Group>
            <Text size="sm">{r.text}</Text>
          </Paper>
        ))
      )}
    </Container>
  );
}

export default ProductPage;
