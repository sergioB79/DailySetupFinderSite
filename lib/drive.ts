import { google, drive_v3 as DriveV3 } from "googleapis";
import { getEnv } from "./env";

export interface DriveFile {
  id: string;
  name: string;
  modifiedTime: string;
}

function getDriveClient(): DriveV3.Drive {
  const env = getEnv();
  const json = Buffer.from(env.GOOGLE_SERVICE_ACCOUNT_JSON_B64, "base64").toString(
    "utf-8",
  );
  const credentials = JSON.parse(json);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return google.drive({ version: "v3", auth });
}

export async function fetchLatestDriveFile(folderId?: string): Promise<{ file: DriveFile; content: string }> {
  const env = getEnv();
  const drive = getDriveClient();

  const list = await drive.files.list({
    pageSize: 1,
    orderBy: "modifiedTime desc",
    q: `'${folderId ?? env.GDRIVE_FOLDER_ID}' in parents and trashed = false`,
    fields: "files(id, name, modifiedTime)",
  });

  const latest = list.data.files?.[0];
  if (!latest?.id || !latest.name || !latest.modifiedTime) {
    throw new Error("No files found in Drive folder or missing metadata.");
  }

  const res = await drive.files.get(
    { fileId: latest.id, alt: "media" },
    { responseType: "arraybuffer" },
  );

  const content = Buffer.from(res.data as ArrayBuffer).toString("utf-8");

  return {
    file: {
      id: latest.id,
      name: latest.name,
      modifiedTime: latest.modifiedTime,
    },
    content,
  };
}
