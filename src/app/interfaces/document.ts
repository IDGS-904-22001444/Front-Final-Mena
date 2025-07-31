export interface Document {
  id?: number;
  fileName: string;
  filePath?: string;
  uploadDate?: Date;
  fileSize?: number;
  contentType?: string;
}