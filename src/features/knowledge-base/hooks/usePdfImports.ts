"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pdfImportService } from "../services/pdf-import.service";
import type { PdfImportStatus, ReviewArticleDto } from "../types/pdf-import.types";

export function usePdfImports(status?: PdfImportStatus) {
  return useQuery({
    queryKey: ["pdf-imports", status ?? "all"],
    queryFn: () => pdfImportService.listImports(status),
  });
}

export function usePdfImport(importId: string | undefined) {
  return useQuery({
    queryKey: ["pdf-import", importId],
    queryFn: () => pdfImportService.getImport(importId!),
    enabled: Boolean(importId),
  });
}

export function useReviewArticle(importId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      articleId,
      dto,
    }: {
      articleId: string;
      dto: ReviewArticleDto;
    }) => pdfImportService.reviewArticle(importId, articleId, dto),

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["pdf-import", importId] });
      void queryClient.invalidateQueries({ queryKey: ["pdf-imports"] });
    },
  });
}
