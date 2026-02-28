import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Stack,
  Group,
  TextInput,
  Select,
  Textarea,
  Button,
  Divider,
  Avatar,
  Box,
  Modal,
  Badge
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import "./ProfilePage.css";

const API_PREFIX = "http://localhost:8000";

export default function ProfilePage({ token }) {
  const [profile, setProfile] = useState({
    fullName: "",
    pronouns: "",
    schoolYear: "",
    major: "",
    bio: ""
  });

  const [draft, setDraft] = useState({ ...profile });
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (!token || token === "INVALID_TOKEN") return;
    fetch(`${API_PREFIX}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch profile.");
      })
      .then((data) => {
        setProfile(data);
        setDraft(data);
      })
      .catch((error) => console.log(error));
  }, [token]);

  const onDraftChange = (key) => (valueOrEvent) => {
    const value =
      typeof valueOrEvent === "string"
        ? valueOrEvent
        : valueOrEvent?.currentTarget?.value ?? "";
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const onSave = () => {
    fetch(`${API_PREFIX}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(draft)
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to save profile.");
      })
      .then((data) => {
        setProfile(data);
        close();
      })
      .catch((error) => console.log(error));
  };

  const onOpen = () => {
    setDraft({ ...profile });
    open();
  };

  const initials = profile.fullName
    ? profile.fullName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <Box className="profile-page">
      {/* Banner + identity section */}
      <Box className="profile-hero">
        <Box className="profile-banner" />
        <Container size="sm" className="profile-identity">
          <Avatar
            size={110}
            radius={110}
            color="green"
            className="profile-avatar"
          >
            {initials}
          </Avatar>

          <div className="profile-name-section">
            <Group gap="xs" align="center">
              <Title order={2}>
                {profile.fullName || "Your Name"}
              </Title>
              {profile.pronouns && (
                <Text c="dimmed" size="sm">
                  ({profile.pronouns})
                </Text>
              )}
            </Group>
            <Group gap="xs" mt={4}>
              {profile.schoolYear && (
                <Badge variant="light" color="green" size="sm">
                  {profile.schoolYear}
                </Badge>
              )}
              {profile.major && (
                <Badge variant="light" color="green" size="sm">
                  {profile.major}
                </Badge>
              )}
            </Group>
          </div>

          <Button
            variant="light"
            size="compact-sm"
            className="profile-edit-btn"
            onClick={onOpen}
          >
            Edit Profile
          </Button>
        </Container>
      </Box>

      {/* Body */}
      <Container size="sm" py="xl">
        <Stack gap="lg">
          {/* Bio card */}
          <Paper withBorder p="lg" radius="md" className="profile-card">
            <Text fw={600} mb="xs">About</Text>
            <Text c={profile.bio ? undefined : "dimmed"} fs={profile.bio ? undefined : "italic"}>
              {profile.bio || "No bio yet."}
            </Text>
          </Paper>

          {/* Details card */}
          <Paper withBorder p="lg" radius="md" className="profile-card">
            <Text fw={600} mb="md">Details</Text>
            <Stack gap="sm">
              <Group>
                <Text size="sm" c="dimmed" w={120}>Name</Text>
                <Text size="sm">{profile.fullName || <Text span c="dimmed" fs="italic">Not set</Text>}</Text>
              </Group>
              <Divider />
              <Group>
                <Text size="sm" c="dimmed" w={120}>Pronouns</Text>
                <Text size="sm">{profile.pronouns || <Text span c="dimmed" fs="italic">Not set</Text>}</Text>
              </Group>
              <Divider />
              <Group>
                <Text size="sm" c="dimmed" w={120}>School Year</Text>
                <Text size="sm">{profile.schoolYear || <Text span c="dimmed" fs="italic">Not set</Text>}</Text>
              </Group>
              <Divider />
              <Group>
                <Text size="sm" c="dimmed" w={120}>Major</Text>
                <Text size="sm">{profile.major || <Text span c="dimmed" fs="italic">Not set</Text>}</Text>
              </Group>
            </Stack>
          </Paper>
        </Stack>
      </Container>

      {/* Edit modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Edit Profile"
        size="md"
        centered
      >
        <Stack gap="md">
          <Group>
            <Avatar radius="xl" size="lg" color="green">
              {draft.fullName
                ? draft.fullName.charAt(0).toUpperCase()
                : "U"}
            </Avatar>
            <div>
              <Text fw={600}>Profile details</Text>
              <Text size="sm" c="dimmed">
                This can be edited anytime.
              </Text>
            </div>
          </Group>

          <Divider />

          <TextInput
            label="Name"
            placeholder="Jordan Lee"
            value={draft.fullName}
            onChange={onDraftChange("fullName")}
            required
          />

          <TextInput
            label="Pronouns"
            placeholder="she/her, he/him, they/them..."
            value={draft.pronouns}
            onChange={onDraftChange("pronouns")}
          />

          <Select
            label="School year"
            placeholder="Select one"
            data={[
              "Freshman",
              "Sophomore",
              "Junior",
              "Senior",
              "Graduate",
              "Other"
            ]}
            value={draft.schoolYear}
            onChange={onDraftChange("schoolYear")}
            clearable
          />

          <TextInput
            label="Major / Program"
            placeholder="Computer Science"
            value={draft.major}
            onChange={onDraftChange("major")}
          />

          <Textarea
            label="Bio"
            placeholder="A couple sentences about you..."
            value={draft.bio}
            onChange={onDraftChange("bio")}
            autosize
            minRows={3}
          />

          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() =>
                setDraft({
                  fullName: "",
                  pronouns: "",
                  schoolYear: "",
                  major: "",
                  bio: ""
                })
              }
            >
              Reset
            </Button>
            <Button onClick={onSave}>Save</Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}
