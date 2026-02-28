// ProfilePage.jsx
import { useState } from "react";
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
} from "@mantine/core";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "",
    pronouns: "",
    schoolYear: "",
    major: "",
    bio: "",
  });

  const onChange = (key) => (valueOrEvent) => {
    const value =
      typeof valueOrEvent === "string"
        ? valueOrEvent
        : valueOrEvent?.currentTarget?.value ?? "";
    setProfile((p) => ({ ...p, [key]: value }));
  };

  const onSave = () => {
    // For now: just prove it works.
    // Later you’ll POST this to your backend / Firebase / etc.
    console.log("Saving profile:", profile);
  };

  return (
    <Container size="sm" py="xl">
      <Stack gap="md">
        <div>
          <Title order={2}>Your profile</Title>
          <Text c="dimmed" size="sm">
            Update your info so others can know how to address you.
          </Text>
        </div>

        <Paper withBorder p="lg" radius="md">
          <Stack gap="md">
            <Group>
              <Avatar radius="xl" size="lg" />
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
              value={profile.fullName}
              onChange={onChange("fullName")}
              required
            />

            <TextInput
              label="Pronouns"
              placeholder="she/her, he/him, they/them…"
              value={profile.pronouns}
              onChange={onChange("pronouns")}
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
                "Other",
              ]}
              value={profile.schoolYear}
              onChange={onChange("schoolYear")}
              clearable
            />

            <TextInput
              label="Major / Program"
              placeholder="Computer Science"
              value={profile.major}
              onChange={onChange("major")}
            />

            <Textarea
              label="Bio"
              placeholder="A couple sentences about you…"
              value={profile.bio}
              onChange={onChange("bio")}
              autosize
              minRows={3}
            />

            <Group justify="flex-end">
              <Button variant="default" onClick={() => setProfile({
                fullName: "",
                pronouns: "",
                schoolYear: "",
                major: "",
                bio: "",
              })}>
                Reset
              </Button>
              <Button onClick={onSave}>Save</Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}