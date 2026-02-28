import { Link } from "react-router-dom";
import { Box, Group, Paper, Stack, Text, Title } from "@mantine/core";

const restaurants = [
  { name: "Campus Market", hours: "10:00 AM - 11:00 PM" },
  { name: "Vista Grande", hours: "7:00 AM - 9:00 PM" },
  { name: "805 Kitchen", hours: "8:00 AM - 10:00 PM" },
  { name: "Poly Deli", hours: "9:00 AM - 4:00 PM" },
  { name: "Red Radish", hours: "10:30 AM - 3:00 PM" },
  { name: "Mustang Station", hours: "7:30 AM - 8:00 PM" }
];

function DiningList() {
  return (
    <Box p="xl" maw={1100} mx="auto">
      <Title order={1} fw={700} mb="lg">
        Cal Poly Dining
      </Title>

      <Stack gap="md">
        {restaurants.map((r) => (
          <Paper
            key={r.name}
            component={Link}
            to="/stores/view"
            shadow="sm"
            radius="md"
            withBorder
            style={{ textDecoration: "none", color: "inherit" }}
          >
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
                  {r.name}
                </Text>
                <Text size="sm" c="dimmed">
                  {r.hours}
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
