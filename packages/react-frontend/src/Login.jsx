import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Title,
  Paper,
  LoadingOverlay
} from "@mantine/core";

export default function Login({ handleSubmit, buttonLabel = "Log In" }) {
  const [creds, setCreds] = useState({ username: "", pwd: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setCreds((prev) => ({ ...prev, [name]: value }));
  }

  async function submitForm(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await handleSubmit(creds);
    } finally {
      setLoading(false);
    }
    setCreds({ username: "", pwd: "" });
  }

  return (
    <Paper maw={400} mx="auto" mt="xl" p="xl" withBorder pos="relative">
      <LoadingOverlay visible={loading} />
      <form onSubmit={submitForm}>
        <Stack>
          <Title order={3}>{buttonLabel}</Title>
          <TextInput
            label="Username"
            name="username"
            value={creds.username}
            onChange={handleChange}
            required
          />
          <PasswordInput
            label="Password"
            name="pwd"
            value={creds.pwd}
            onChange={handleChange}
            required
          />
          <Button type="submit" fullWidth>
            {buttonLabel}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
