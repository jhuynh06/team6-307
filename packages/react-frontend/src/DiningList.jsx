import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Group, Paper, Stack, Text, Title, Skeleton } from "@mantine/core";
import { API_PREFIX } from "./config";

function DiningList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_PREFIX}/stores`)
      .then((res) => res.json())
      .then((data) => {
        setStores(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch stores:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Box p="xl" maw={1100} mx="auto">
      <Title order={1} fw={700} mb="lg">
        Cal Poly Dining
      </Title>

      <Stack gap="md">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, i) => <Skeleton key={i} height={100} radius="md" />)
          : stores.map((store) => (
              <Paper
                key={store._id}
                component={Link}
                to={`/stores/${store._id}`}
                shadow="sm"
                radius="md"
                withBorder
                style={{
                  textDecoration: "none",
                  color: "inherit"
                }}>
                <Group wrap="nowrap" gap={0}>
                  <Box
                    w={140}
                    miw={140}
                    h={100}
                    bg="green.6"
                    style={{
                      borderRadius:
                        "var(--mantine-radius-md) 0 0 var(--mantine-radius-md)"
                    }}
                  />
                  <Box p="md">
                    <Text fw={600} size="lg">
                      {store.name}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {store.hours}
                    </Text>
                  </Box>
                </Group>
              </Paper>
            ))}
      </Stack>
    </Box>
  );
}

export default DiningList;
