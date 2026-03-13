import { useState, useEffect, useCallback } from "react";
import {
  Tabs,
  Table,
  Button,
  Group,
  Modal,
  TextInput,
  Textarea,
  Select,
  Switch,
  FileInput,
  Stack,
  Title,
  Image,
  LoadingOverlay,
  Container,
  Text,
  Paper,
  Box
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { API_PREFIX } from "./config";

async function uploadImage(file, token) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${API_PREFIX}/admin/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url;
}

async function apiFetch(path, token, options = {}) {
  const res = await fetch(`${API_PREFIX}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }
  if (res.status === 204) return null;
  return res.json();
}

const CATEGORIES = [
  { value: "Entree", label: "Entree" },
  { value: "Side", label: "Side" },
  { value: "Drink", label: "Drink" },
  { value: "Dessert", label: "Dessert" },
  { value: "Snack", label: "Snack" },
  { value: "Other", label: "Other" }
];

function ProductsTab({ token }) {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [storeId, setStoreId] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "",
    inStock: true,
    description: "",
    tags: "",
    image: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/admin/products", token);
      setProducts(data);
    } catch (e) {
      notifications.show({ title: "Error", message: e.message, color: "red" });
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchStores = useCallback(async () => {
    try {
      const data = await apiFetch("/admin/stores", token);
      setStores(data);
    } catch (e) {
      notifications.show({ title: "Error", message: e.message, color: "red" });
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
    fetchStores();
  }, [fetchProducts, fetchStores]);

  function openAdd() {
    setEditing(null);
    setForm({
      name: "",
      category: "",
      inStock: true,
      description: "",
      tags: "",
      image: ""
    });
    setStoreId(stores.length > 0 ? stores[0]._id : "");
    setImageFile(null);
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setForm({
      name: product.name || "",
      category: product.category || "",
      inStock: product.inStock ?? true,
      description: product.description || "",
      tags: (product.tags || []).join(", "),
      image: product.image || ""
    });
    setStoreId(product.storeId);
    setImageFile(null);
    setModalOpen(true);
  }

  async function handleUploadImage() {
    if (!imageFile) return;
    setUploading(true);
    try {
      const url = await uploadImage(imageFile, token);
      setForm((f) => ({ ...f, image: url }));
      setImageFile(null);
      notifications.show({
        title: "Uploaded",
        message: "Image uploaded.",
        color: "green"
      });
    } catch (e) {
      notifications.show({
        title: "Upload Failed",
        message: e.message,
        color: "red"
      });
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    const body = {
      name: form.name,
      category: form.category,
      inStock: form.inStock,
      description: form.description,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      image: form.image
    };
    try {
      if (editing) {
        const originalStoreId = editing.storeId;
        const payload =
          storeId !== originalStoreId ? { ...body, newStoreId: storeId } : body;
        await apiFetch(
          `/admin/stores/${originalStoreId}/products/${editing._id}`,
          token,
          { method: "PUT", body: JSON.stringify(payload) }
        );
        notifications.show({
          title: "Updated",
          message: "Product updated.",
          color: "green"
        });
      } else {
        await apiFetch(`/admin/stores/${storeId}/products`, token, {
          method: "POST",
          body: JSON.stringify(body)
        });
        notifications.show({
          title: "Created",
          message: "Product created.",
          color: "green"
        });
      }
      setModalOpen(false);
      fetchProducts();
    } catch (e) {
      notifications.show({ title: "Error", message: e.message, color: "red" });
    }
  }

  async function handleDelete(product) {
    try {
      await apiFetch(
        `/admin/stores/${product.storeId}/products/${product._id}`,
        token,
        { method: "DELETE" }
      );
      notifications.show({
        title: "Deleted",
        message: "Product deleted.",
        color: "green"
      });
      fetchProducts();
    } catch (e) {
      notifications.show({ title: "Error", message: e.message, color: "red" });
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay visible={loading} />
      <Group mb="md" justify="space-between">
        <Title order={4}>Products</Title>
        <Button onClick={openAdd} disabled={stores.length === 0}>
          Add Product
        </Button>
      </Group>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>In Stock</Table.Th>
            <Table.Th>Store</Table.Th>
            <Table.Th>Image</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {products.map((p) => (
            <Table.Tr key={p._id}>
              <Table.Td>{p.name}</Table.Td>
              <Table.Td>{p.category}</Table.Td>
              <Table.Td>{p.inStock ? "Yes" : "No"}</Table.Td>
              <Table.Td>{p.storeName}</Table.Td>
              <Table.Td>
                {p.image && (
                  <Image src={p.image} w={40} h={40} fit="cover" radius="sm" />
                )}
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button
                    variant="subtle"
                    size="compact-xs"
                    color="blue"
                    onClick={() => openEdit(p)}>
                    Edit
                  </Button>
                  <Button
                    variant="subtle"
                    size="compact-xs"
                    color="red"
                    onClick={() => handleDelete(p)}>
                    Delete
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Product" : "Add Product"}>
        <Stack>
          <Select
            label="Store"
            description={editing ? "Change to move this product" : undefined}
            data={stores.map((s) => ({ value: s._id, label: s.name }))}
            value={storeId}
            onChange={setStoreId}
            required
          />
          <TextInput
            label="Name"
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({ ...f, name: e.currentTarget.value }))
            }
            required
          />
          <Select
            label="Category"
            data={CATEGORIES}
            value={form.category}
            onChange={(val) => setForm((f) => ({ ...f, category: val || "" }))}
          />
          <Switch
            label="In Stock"
            checked={form.inStock}
            onChange={(e) =>
              setForm((f) => ({ ...f, inStock: e.currentTarget.checked }))
            }
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.currentTarget.value }))
            }
          />
          <TextInput
            label="Tags (comma separated)"
            value={form.tags}
            onChange={(e) =>
              setForm((f) => ({ ...f, tags: e.currentTarget.value }))
            }
          />
          <Paper withBorder p="sm" radius="md" bg="var(--mantine-color-gray-0)">
            <Text fw={500} size="sm" mb="xs">
              Product Image
            </Text>
            {form.image ? (
              <Image
                src={form.image}
                w={120}
                h={120}
                fit="cover"
                radius="sm"
                mb="xs"
              />
            ) : (
              <Box
                w={120}
                h={120}
                mb="xs"
                style={{
                  border: "2px dashed var(--mantine-color-gray-4)",
                  borderRadius: "var(--mantine-radius-sm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                <Text size="xs" c="dimmed" ta="center">
                  No image
                </Text>
              </Box>
            )}
            <FileInput
              placeholder="Choose image file..."
              accept="image/*"
              value={imageFile}
              onChange={setImageFile}
              size="sm"
            />
            {imageFile && (
              <Button
                size="xs"
                mt="xs"
                onClick={handleUploadImage}
                loading={uploading}>
                Upload Image
              </Button>
            )}
          </Paper>
          <Button onClick={handleSave}>
            {editing ? "Save Changes" : "Add Product"}
          </Button>
        </Stack>
      </Modal>
    </div>
  );
}

function StoresTab({ token }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    hours: "",
    isOpen: true,
    bannerImage: "",
    cardImage: "",
    profileImage: ""
  });
  const [imageFiles, setImageFiles] = useState({
    bannerImage: null,
    cardImage: null,
    profileImage: null
  });
  const [uploading, setUploading] = useState("");

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/admin/stores", token);
      setStores(data);
    } catch (e) {
      notifications.show({ title: "Error", message: e.message, color: "red" });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  function openAdd() {
    setEditing(null);
    setForm({
      name: "",
      hours: "",
      isOpen: true,
      bannerImage: "",
      cardImage: "",
      profileImage: ""
    });
    setImageFiles({ bannerImage: null, cardImage: null, profileImage: null });
    setModalOpen(true);
  }

  function openEdit(store) {
    setEditing(store);
    setForm({
      name: store.name || "",
      hours: store.hours || "",
      isOpen: store.isOpen ?? true,
      bannerImage: store.bannerImage || "",
      cardImage: store.cardImage || "",
      profileImage: store.profileImage || ""
    });
    setImageFiles({ bannerImage: null, cardImage: null, profileImage: null });
    setModalOpen(true);
  }

  async function handleUploadField(field) {
    const file = imageFiles[field];
    if (!file) return;
    setUploading(field);
    try {
      const url = await uploadImage(file, token);
      setForm((f) => ({ ...f, [field]: url }));
      setImageFiles((f) => ({ ...f, [field]: null }));
      notifications.show({
        title: "Uploaded",
        message: `${field} uploaded.`,
        color: "green"
      });
    } catch (e) {
      notifications.show({
        title: "Upload Failed",
        message: e.message,
        color: "red"
      });
    } finally {
      setUploading("");
    }
  }

  async function handleSave() {
    const body = {
      name: form.name,
      hours: form.hours,
      isOpen: form.isOpen,
      bannerImage: form.bannerImage,
      cardImage: form.cardImage,
      profileImage: form.profileImage
    };
    try {
      if (editing) {
        await apiFetch(`/admin/stores/${editing._id}`, token, {
          method: "PUT",
          body: JSON.stringify(body)
        });
        notifications.show({
          title: "Updated",
          message: "Store updated.",
          color: "green"
        });
      } else {
        await apiFetch("/admin/stores", token, {
          method: "POST",
          body: JSON.stringify(body)
        });
        notifications.show({
          title: "Created",
          message: "Store created.",
          color: "green"
        });
      }
      setModalOpen(false);
      fetchStores();
    } catch (e) {
      notifications.show({ title: "Error", message: e.message, color: "red" });
    }
  }

  async function handleDelete(store) {
    try {
      await apiFetch(`/admin/stores/${store._id}`, token, {
        method: "DELETE"
      });
      notifications.show({
        title: "Deleted",
        message: "Store deleted.",
        color: "green"
      });
      fetchStores();
    } catch (e) {
      notifications.show({ title: "Error", message: e.message, color: "red" });
    }
  }

  function renderImageField(field, label) {
    return (
      <Paper withBorder p="sm" radius="md" bg="var(--mantine-color-gray-0)">
        <Text fw={500} size="sm" mb="xs">
          {label}
        </Text>
        {form[field] ? (
          <Image
            src={form[field]}
            w={120}
            h={70}
            fit="cover"
            radius="sm"
            mb="xs"
          />
        ) : (
          <Box
            w={120}
            h={70}
            mb="xs"
            style={{
              border: "2px dashed var(--mantine-color-gray-4)",
              borderRadius: "var(--mantine-radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
            <Text size="xs" c="dimmed" ta="center">
              No image
            </Text>
          </Box>
        )}
        <FileInput
          placeholder="Choose image file..."
          accept="image/*"
          value={imageFiles[field]}
          onChange={(file) => setImageFiles((f) => ({ ...f, [field]: file }))}
          size="sm"
        />
        {imageFiles[field] && (
          <Button
            size="xs"
            mt="xs"
            onClick={() => handleUploadField(field)}
            loading={uploading === field}>
            Upload {label}
          </Button>
        )}
      </Paper>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay visible={loading} />
      <Group mb="md" justify="space-between">
        <Title order={4}>Stores</Title>
        <Button onClick={openAdd}>Add Store</Button>
      </Group>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Hours</Table.Th>
            <Table.Th>Open</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {stores.map((s) => (
            <Table.Tr key={s._id}>
              <Table.Td>{s.name}</Table.Td>
              <Table.Td>{s.hours}</Table.Td>
              <Table.Td>{s.isOpen ? "Yes" : "No"}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button
                    variant="subtle"
                    size="compact-xs"
                    color="blue"
                    onClick={() => openEdit(s)}>
                    Edit
                  </Button>
                  <Button
                    variant="subtle"
                    size="compact-xs"
                    color="red"
                    onClick={() => handleDelete(s)}>
                    Delete
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Store" : "Add Store"}>
        <Stack>
          <TextInput
            label="Name"
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({ ...f, name: e.currentTarget.value }))
            }
            required
          />
          <TextInput
            label="Hours"
            value={form.hours}
            onChange={(e) =>
              setForm((f) => ({ ...f, hours: e.currentTarget.value }))
            }
          />
          <Switch
            label="Open"
            checked={form.isOpen}
            onChange={(e) =>
              setForm((f) => ({ ...f, isOpen: e.currentTarget.checked }))
            }
          />
          {renderImageField("bannerImage", "Banner Image")}
          {renderImageField("cardImage", "Card Image")}
          {renderImageField("profileImage", "Profile Image")}
          <Button onClick={handleSave}>
            {editing ? "Save Changes" : "Add Store"}
          </Button>
        </Stack>
      </Modal>
    </div>
  );
}

export default function AdminPanel({ token }) {
  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">
        Admin Panel
      </Title>
      <Tabs defaultValue="products">
        <Tabs.List>
          <Tabs.Tab value="products">Products</Tabs.Tab>
          <Tabs.Tab value="stores">Stores</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="products" pt="md">
          <ProductsTab token={token} />
        </Tabs.Panel>
        <Tabs.Panel value="stores" pt="md">
          <StoresTab token={token} />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
