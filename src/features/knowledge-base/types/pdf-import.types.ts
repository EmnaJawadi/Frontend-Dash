export type PdfImportStatus = "PENDING_REVIEW" | "PARTIALLY_DONE" | "COMPLETED";
export type DraftArticleStatus = "PENDING" | "APPROVED" | "REJECTED" | "EDITED";

export interface PdfDraftArticle {
  id: string;
  importId: string;
  title: string;
  category: string;
  body: string;
  tags: string[];
  status: DraftArticleStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  kbArticleId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PdfImportUploader {
  id: string;
  fullName: string | null;
  email: string;
}

export interface PdfImportDraft {
  id: string;
  companyId: string;
  uploadedBy: string;
  fileName: string;
  status: PdfImportStatus;
  createdAt: string;
  updatedAt: string;
  articles: PdfDraftArticle[];
  uploader: PdfImportUploader;
}

export interface UploadPdfResponse {
  importId: string;
  fileName: string;
  articleCount: number;
  articles: PdfDraftArticle[];
}

export interface ReviewArticleDto {
  action: "approve" | "reject" | "edit";
  title?: string;
  category?: string;
  body?: string;
  tags?: string[];
}
