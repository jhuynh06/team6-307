import { jest } from "@jest/globals";

const mockUploadData = jest.fn();
const mockCreateIfNotExists = jest.fn();
const mockGetBlockBlobClient = jest.fn();

const mockBlockBlobClient = {
  uploadData: mockUploadData,
  url: "http://fake-url.com/file.png"
};

const mockContainerClient = {
  createIfNotExists: mockCreateIfNotExists,
  getBlockBlobClient: mockGetBlockBlobClient
};

const mockBlobServiceClient = {
  getContainerClient: jest.fn()
};

jest.unstable_mockModule("@azure/storage-blob", () => ({
  BlobServiceClient: {
    fromConnectionString: jest.fn(() => mockBlobServiceClient)
  }
}));

describe("uploadToAzure", () => {
  beforeEach(() => {
    jest.resetModules();

    mockUploadData.mockResolvedValue({});
    mockCreateIfNotExists.mockResolvedValue({});
    mockGetBlockBlobClient.mockReturnValue(mockBlockBlobClient);
    mockBlobServiceClient.getContainerClient.mockReturnValue(mockContainerClient);
  });

  test("throws error if connection string is missing", async () => {
    delete process.env.AZURE_STORAGE_CONNECTION_STRING;

    const { uploadToAzure } = await import("../services/upload-service.js");

    await expect(
      uploadToAzure(Buffer.from("test"), "file.png", "image/png")
    ).rejects.toThrow("Azure Storage connection string is not configured.");
  });

  test("uploads file and returns the url", async () => {
    process.env.AZURE_STORAGE_CONNECTION_STRING = "fake";

    const { uploadToAzure } = await import("../services/upload-service.js");

    const result = await uploadToAzure(
      Buffer.from("test"),
      "file.png",
      "image/png"
    );

    expect(result).toBe("http://fake-url.com/file.png");
    expect(mockCreateIfNotExists).toHaveBeenCalled();
    expect(mockGetBlockBlobClient).toHaveBeenCalled();
    expect(mockUploadData).toHaveBeenCalled();
  });
});