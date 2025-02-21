import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

export const ImageUpload = ({
  onImageUpload,
  type,
  label,
}: {
  onImageUpload?: (imageUrl: string) => void;
  type?: "projects" | "content";
  label?: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isQueryEnabled, setIsQueryEnabled] = useState(false);

  /*const { data: presignedURL, refetch: refetchPresignedUrl } =
    api.images.generatePresignedUrl.useQuery(
      {
        imageUrl: selectedFile?.name || "",
        location: type,
      },
      {
        enabled: !!selectedFile && !!isQueryEnabled,
      },
    );

  useEffect(() => {
    if (selectedFile) {
      setIsQueryEnabled(true);
      refetchPresignedUrl();
      setIsQueryEnabled(false);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (presignedURL) {
      axios.put(presignedURL.presignedUrl!, selectedFile!, {
        headers: {
          "Content-Type": selectedFile!.type,
        },
      });
      toast.success(`${selectedFile!.name} uploaded successfully!`);
      onImageUpload(`${selectedFile!.name}`);
      console.log(presignedURL.presignedUrl);
    }
  }, [presignedURL]); */

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFiles((prevFiles) => [...prevFiles, file]);
    }
    setIsDragging(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFiles((prevFiles) => [...prevFiles, file]);
    }
  };

  return (
    <div className="flex h-fit flex-col space-y-1">
      <label className="font-medium text-[#1b1b1b]">{label}</label>
      <div className="flex flex-col gap-1">
        <div
          className={`flex aspect-[7/1] w-full items-center justify-center rounded border-2 border-dashed ${
            isDragging ? "border-gray-400 bg-gray-200" : "border-gray-400"
          } p-4`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="product-image"
            onChange={handleFileSelect}
          />
          <label
            htmlFor="product-image"
            className="cursor-pointer text-gray-400 hover:underline"
          >
            {isUploading
              ? "Wird hochgeladen..."
              : selectedFiles.length
                ? selectedFiles.map((file) => file.name).join(", ")
                : isDragging
                  ? "Datei hierher ziehen"
                  : "Produktbild hierher ziehen oder klicken*"}
          </label>
        </div>
        <p className="text-sm text-[#676769]">
          *Maximale Dateigröße: 10 MB, Formate: Bilder
        </p>
      </div>
      {selectedFiles.length > 0 && !isUploading && (
        <div className="mt-2 text-sm text-gray-500">
          Hochgeladen: {selectedFiles.map((file) => file.name).join(", ")}
        </div>
      )}
    </div>
  );
};
