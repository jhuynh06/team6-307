import { Burger, Group, Text, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation } from "react-router-dom";
import classes from "./Header.module.css";

const links = [
  { link: "/", label: "Home" },
  { link: "/explore", label: "Explore" },
  { link: "/stores", label: "Stores" }
];

export default function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const { pathname } = useLocation();

  const items = links.map((item) => (
    <Link
      key={item.label}
      to={item.link}
      className={classes.link}
      data-active={pathname === item.link || undefined}
    >
      {item.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Group className={classes.inner} px="md">
        <Group gap={10}>
          <Box
            w={36}
            h={36}
            bg="#888"
            style={{ borderRadius: "50%", flexShrink: 0 }}
          />
          <Text fw={700} fz="lg" style={{ letterSpacing: 1 }}>
            POLY RATE
          </Text>
        </Group>

        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="xs"
          size="sm"
          aria-label="Toggle navigation"
        />
      </Group>
    </header>
  );
}
