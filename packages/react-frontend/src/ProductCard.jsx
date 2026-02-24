import { Card, Box, Text } from "@mantine/core";

function ProductCard({ product }) {
    const { name } = product;

    return (
        <Card shadow="sm" padding="sm" radius="md" withBorder>
            <Card.Section>
                <Box
                    style={{
                        backgroundColor: "#DCE775",
                        aspectRatio: "4 / 3",
                        width: "100%"
                    }}
                />
            </Card.Section>
            <Text mt="xs" size="sm" fw={600} c="#222">
                {name}
            </Text>
        </Card>
    );
}

export default ProductCard;
