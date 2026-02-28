import { Burger, Group, Text, Box, Button, Avatar, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./Header.module.css";

const links = [
  { link: "/", label: "Home" },
  { link: "/explore", label: "Explore" },
  { link: "/stores", label: "Stores" }
];

export default function Header({ isLoggedIn, onLogout }) {
  const [opened, { toggle }] = useDisclosure(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const activeTab = links.find((l) => l.link === pathname)?.link || null;

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
            POLY RATE MY FOOD
          </Text>
        </Group>

        <Tabs
          value={activeTab}
          onChange={(value) => navigate(value)}
          variant="default"
          visibleFrom="xs"
          classNames={{ root: classes.tabs, list: classes.tabList, tab: classes.tab }}
        >
          <Tabs.List>
            {links.map((item) => (
              <Tabs.Tab key={item.link} value={item.link}>
                {item.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>

        <Group gap="sm" visibleFrom="xs">
          {isLoggedIn ? (
            <>
              <Avatar
                radius="xl"
                size="md"
                color="green"
                className={`${classes.avatar} ${pathname === "/profile" ? classes.avatarActive : ""}`}
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer" }}
              >
                U
              </Avatar>
              <Button variant="subtle" size="compact-md" onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="filled"
                size="compact-md"
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
              <Button
                variant="outline"
                size="compact-md"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </>
          )}
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
