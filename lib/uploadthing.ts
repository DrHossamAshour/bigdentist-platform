import { createUploadthing, type FileRouter } from "uploadthing/next";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const f = createUploadthing();

// Helper function to get user from JWT token
const getUserFromToken = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      throw new Error("No token found");
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Verify user is authenticated
      const user = await getUserFromToken();
      if (!user) throw new Error("Unauthorized");

      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  videoUploader: f({ video: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await getUserFromToken();
      if (!user) throw new Error("Unauthorized");

      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Video upload complete for userId:", metadata.userId);
      console.log("Video URL:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  documentUploader: f({ 
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
    text: { maxFileSize: "1MB", maxFileCount: 1 }
  })
    .middleware(async () => {
      const user = await getUserFromToken();
      if (!user) throw new Error("Unauthorized");

      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Document upload complete for userId:", metadata.userId);
      console.log("Document URL:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  courseThumbnail: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await getUserFromToken();
      if (!user) throw new Error("Unauthorized");

      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Course thumbnail upload complete for userId:", metadata.userId);
      console.log("Thumbnail URL:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter; 