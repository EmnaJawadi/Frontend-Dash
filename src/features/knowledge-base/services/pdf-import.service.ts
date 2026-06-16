import { apiClient } from "@/src/lib/api-client";
import type {
  PdfImportDraft,
  PdfImportStatus,
  ReviewArticleDto,
  UploadPdfResponse,
  PdfDraftArticle,
} from "../types/pdf-import.types";

const BASE = "/knowledge-base/pdf-imports";

export const pdfImportService = {
  uploadPdf(file: File): Promise<UploadPdfResponse> {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.postForm<UploadPdfResponse>(`${BASE}/upload`, formData);
  },

  listImports(status?: PdfImportStatus): Promise<PdfImportDraft[]> {
    const query = status ? `?status=${status}` : "";
    return apiClient.get<PdfImportDraft[]>(`${BASE}${query}`);
  },

  getImport(importId: string): Promise<PdfImportDraft> {
    return apiClient.get<PdfImportDraft>(`${BASE}/${importId}`);
  },

  reviewArticle(
    importId: string,
    articleId: string,
    dto: ReviewArticleDto
  ): Promise<PdfDraftArticle> {
    return apiClient.patch<PdfDraftArticle>(
      `${BASE}/${importId}/articles/${articleId}`,
      dto
    );
  },
};
