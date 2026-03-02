import React, { useState } from "react";
import { TextInput, PasswordInput, Button, Stack, Title, Paper, Alert } from "@mantine/core";

export default function Login({ handleSubmit, buttonLabel = "Log In", message = "" }) {
  const [creds, setCreds] = useState({ username: "", pwd: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setCreds((prev) => ({ ...prev, [name]: value }));
  }

  function submitForm(event) {
    event.preventDefault();
    handleSubmit(creds);
    setCreds({ username: "", pwd: "" });
  }

  return (
    <Paper maw={400} mx="auto" mt="xl" p="xl" withBorder>
      <form onSubmit={submitForm}>
        <Stack>
          <Title order={3}>{buttonLabel}</Title>
          {message && (
            <Alert
              color={message.toLowerCase().includes("fail") || message.toLowerCase().includes("taken") ? "red" : "green"}
              variant="light"
            >
              {message}
            </Alert>
          )}
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
