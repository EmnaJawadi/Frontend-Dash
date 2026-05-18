"use client";

import * as React from "react";
import {
  ImageIcon,
  ImagePlus,
  Loader2,
  Package,
  PackageCheck,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/src/components/shared/data-table";
import { isApiError } from "@/src/lib/api-error";
import { getUserRole } from "@/src/lib/auth";
import { productsService } from "@/src/services/products.service";
import type { Product, ProductPayload, ProductStatus } from "@/src/types/product";
import type { UserRole } from "@/src/types/role";

type ProductFormState = {
  name: string;
  description: string;
  category: string;
  price: string;
  currency: string;
  isAvailable: boolean;
  status: ProductStatus;
  keywords: string;
};

type ProductImageInputMode = "file" | "url";

const EMPTY_FORM: ProductFormState = {
  name: "",
  description: "",
  category: "",
  price: "",
  currency: "TND",
  isAvailable: true,
  status: "ACTIVE",
  keywords: "",
};

function statusLabel(status: ProductStatus) {
  switch (status) {
    case "ACTIVE":
      return "Actif";
    case "INACTIVE":
      return "Inactif";
    case "ARCHIVED":
      return "Archive";
    default:
      return status;
  }
}

function statusClasses(status: ProductStatus) {
  if (status === "ACTIVE") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "ARCHIVED") {
    return "border-slate-300 bg-slate-100 text-slate-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function formatPrice(product: Product) {
  if (product.price === null || product.price === undefined) return "-";

  try {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: product.currency || "TND",
    }).format(product.price);
  } catch {
    return `${product.price} ${product.currency || "TND"}`;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function getPrimaryImage(product: Product) {
  return product.images?.[0]?.imageUrl || null;
}

function normalizeText(value?: string | null) {
  return (value ?? "").trim();
}

function formFromProduct(product: Product): ProductFormState {
  return {
    name: product.name,
    description: product.description ?? "",
    category: product.category ?? "",
    price: product.price === null || product.price === undefined ? "" : String(product.price),
    currency: product.currency || "TND",
    isAvailable: product.isAvailable,
    status: product.status,
    keywords: (product.keywords ?? []).join(", "),
  };
}

function keywordsFromInput(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[,\n]+/)
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

function buildPayload(form: ProductFormState): ProductPayload {
  const priceText = form.price.trim();
  const parsedPrice = priceText ? Number(priceText.replace(",", ".")) : null;

  return {
    name: form.name.trim(),
    description: normalizeText(form.description) || null,
    category: normalizeText(form.category) || null,
    price: Number.isFinite(parsedPrice) ? parsedPrice : null,
    currency: normalizeText(form.currency) || "TND",
    isAvailable: form.isAvailable,
    status: form.status,
    keywords: keywordsFromInput(form.keywords),
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  if (isApiError(error)) {
    return error.message || fallback;
  }
  return fallback;
}

function ProductThumb({ product }: { product: Product }) {
  const imageUrl = getPrimaryImage(product);

  if (!imageUrl) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-muted/60 text-muted-foreground">
        <Package className="h-5 w-5" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={product.images[0]?.altText || product.name}
      className="h-14 w-14 shrink-0 rounded-xl border border-border/70 object-cover"
    />
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3 p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className="rounded-xl bg-muted p-2.5 text-muted-foreground">{icon}</div>
      </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  const [role, setRole] = React.useState<UserRole | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isImageSubmitting, setIsImageSubmitting] = React.useState(false);
  const [deactivatingProductId, setDeactivatingProductId] = React.useState<string | null>(null);
  const [deletingImageId, setDeletingImageId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<ProductStatus | "all">("all");
  const [category, setCategory] = React.useState<string | "all">("all");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [form, setForm] = React.useState<ProductFormState>(EMPTY_FORM);

  const [imageProduct, setImageProduct] = React.useState<Product | null>(null);
  const [imageInputMode, setImageInputMode] = React.useState<ProductImageInputMode>("file");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageAltText, setImageAltText] = React.useState("");
  const imageFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const canManage = role === "OWNER";

  const loadProducts = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await productsService.list({ page: 1, limit: 100 });
      setProducts(response.items ?? []);
    } catch (err) {
      console.error("Failed to load products", err);
      setProducts([]);
      setError(getErrorMessage(err, "Impossible de charger les produits."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    setRole(getUserRole());
    void loadProducts();
  }, [loadProducts]);

  const categories = React.useMemo(() => {
    return Array.from(
      new Set(products.map((product) => product.category).filter(Boolean) as string[]),
    ).sort((a, b) => a.localeCompare(b, "fr"));
  }, [products]);

  const filteredProducts = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        normalizeText(product.description).toLowerCase().includes(query) ||
        normalizeText(product.category).toLowerCase().includes(query) ||
        (product.keywords ?? []).some((keyword) =>
          keyword.toLowerCase().includes(query),
        );

      const matchesStatus = status === "all" || product.status === status;
      const matchesCategory = category === "all" || product.category === category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, search, status, category]);

  const stats = React.useMemo(
    () => ({
      total: products.length,
      active: products.filter((product) => product.status === "ACTIVE").length,
      available: products.filter((product) => product.isAvailable).length,
      images: products.reduce((count, product) => count + (product.images?.length ?? 0), 0),
    }),
    [products],
  );

  function resetFilters() {
    setSearch("");
    setStatus("all");
    setCategory("all");
  }

  function openCreateDialog() {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setError(null);
    setSuccess(null);
    setFormOpen(true);
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product);
    setForm(formFromProduct(product));
    setError(null);
    setSuccess(null);
    setFormOpen(true);
  }

  function openImagesDialog(product: Product) {
    setImageProduct(product);
    setImageInputMode("file");
    setImageFile(null);
    setImageUrl("");
    setImageAltText("");
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = "";
    }
    setError(null);
    setSuccess(null);
  }

  async function handleSaveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Le nom du produit est obligatoire.");
      return;
    }

    if (form.price.trim()) {
      const parsed = Number(form.price.replace(",", "."));
      if (!Number.isFinite(parsed) || parsed < 0) {
        setError("Le prix doit etre un nombre positif.");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const payload = buildPayload(form);
      if (editingProduct) {
        await productsService.update(editingProduct.id, payload);
        setSuccess("Produit modifie avec succes.");
      } else {
        await productsService.create(payload);
        setSuccess("Produit ajoute avec succes.");
      }

      setFormOpen(false);
      await loadProducts();
    } catch (err) {
      console.error("Failed to save product", err);
      setError(getErrorMessage(err, "Impossible de sauvegarder le produit."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeactivateProduct(product: Product) {
    const confirmed = window.confirm(`Desactiver le produit "${product.name}" ?`);
    if (!confirmed) return;

    try {
      setDeactivatingProductId(product.id);
      setError(null);
      setSuccess(null);
      await productsService.deactivate(product.id);
      await loadProducts();
      setSuccess("Produit desactive avec succes.");
    } catch (err) {
      console.error("Failed to deactivate product", err);
      setError(getErrorMessage(err, "Impossible de desactiver le produit."));
    } finally {
      setDeactivatingProductId(null);
    }
  }

  async function handleAddImage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!imageProduct) return;

    const altText = imageAltText.trim() || null;
    const url = imageUrl.trim();

    if (imageInputMode === "file" && !imageFile) {
      setError("Choisis un fichier image.");
      return;
    }

    if (imageInputMode === "url" && !url) {
      setError("L'URL de l'image est obligatoire.");
      return;
    }

    try {
      setIsImageSubmitting(true);
      setError(null);
      setSuccess(null);
      const updatedProduct =
        imageInputMode === "file" && imageFile
          ? await productsService.uploadImage(imageProduct.id, {
              file: imageFile,
              altText,
            })
          : await productsService.addImages(imageProduct.id, {
              images: [
                {
                  imageUrl: url,
                  altText,
                },
              ],
            });

      setImageProduct(updatedProduct);
      setImageFile(null);
      setImageUrl("");
      setImageAltText("");
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = "";
      }
      await loadProducts();
      setSuccess("Image ajoutee au produit.");
    } catch (err) {
      console.error("Failed to add product image", err);
      setError(getErrorMessage(err, "Impossible d'ajouter l'image."));
    } finally {
      setIsImageSubmitting(false);
    }
  }

  async function handleDeleteImage(product: Product, imageId: string) {
    const confirmed = window.confirm("Supprimer cette image produit ?");
    if (!confirmed) return;

    try {
      setDeletingImageId(imageId);
      setError(null);
      setSuccess(null);
      await productsService.deleteImage(product.id, imageId);
      const refreshed = await productsService.getById(product.id);
      setImageProduct(refreshed);
      await loadProducts();
      setSuccess("Image supprimee.");
    } catch (err) {
      console.error("Failed to delete product image", err);
      setError(getErrorMessage(err, "Impossible de supprimer l'image."));
    } finally {
      setDeletingImageId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Produits" value={stats.total} icon={<Package className="h-5 w-5" />} />
        <StatCard title="Actifs" value={stats.active} icon={<PackageCheck className="h-5 w-5" />} />
        <StatCard title="Disponibles" value={stats.available} icon={<PackageCheck className="h-5 w-5" />} />
        <StatCard title="Images" value={stats.images} icon={<ImageIcon className="h-5 w-5" />} />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher produit, categorie ou mot-cle"
                className="h-11 pl-10 pr-10"
              />
              {search ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setSearch("")}
                  aria-label="Effacer la recherche"
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as ProductStatus | "all")}
              >
                <SelectTrigger className="h-11 w-full xl:w-[170px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="ACTIVE">Actif</SelectItem>
                  <SelectItem value="INACTIVE">Inactif</SelectItem>
                  <SelectItem value="ARCHIVED">Archive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11 w-full xl:w-[190px]">
                  <SelectValue placeholder="Categorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes categories</SelectItem>
                  {categories.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button type="button" variant="outline" onClick={resetFilters}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reinitialiser
              </Button>

              {canManage ? (
                <Button type="button" onClick={openCreateDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter produit
                </Button>
              ) : (
                <Badge variant="outline" className="h-10 justify-center rounded-xl">
                  Consultation agent
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {error ? <p className="app-alert border-destructive/30 bg-destructive/10 text-destructive">{error}</p> : null}
      {success ? <p className="app-alert border-emerald-300 bg-emerald-50 text-emerald-700">{success}</p> : null}

      <div className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        {isLoading ? "Chargement..." : `${filteredProducts.length} produit(s) trouve(s)`}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement du catalogue...
        </div>
      ) : (
        <DataTable
          data={filteredProducts}
          rowKey={(product) => product.id}
          emptyMessage="Aucun produit trouve."
          columns={[
            {
              key: "product",
              header: "Produit",
              className: "min-w-[260px]",
              render: (product) => (
                <div className="flex min-w-0 items-center gap-3">
                  <ProductThumb product={product} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">{product.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {product.description || "Sans description"}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              key: "category",
              header: "Categorie",
              className: "min-w-[150px]",
              render: (product) => product.category || "-",
            },
            {
              key: "price",
              header: "Prix",
              className: "min-w-[120px]",
              render: (product) => <span className="font-semibold">{formatPrice(product)}</span>,
            },
            {
              key: "images",
              header: "Images",
              className: "min-w-[110px]",
              render: (product) => (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openImagesDialog(product)}
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  {product.images?.length ?? 0}
                </Button>
              ),
            },
            {
              key: "availability",
              header: "Disponibilite",
              className: "min-w-[140px]",
              render: (product) => (
                <Badge
                  variant="outline"
                  className={
                    product.isAvailable
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-300 bg-slate-100 text-slate-700"
                  }
                >
                  {product.isAvailable ? "Disponible" : "Indisponible"}
                </Badge>
              ),
            },
            {
              key: "status",
              header: "Statut",
              className: "min-w-[120px]",
              render: (product) => (
                <Badge variant="outline" className={statusClasses(product.status)}>
                  {statusLabel(product.status)}
                </Badge>
              ),
            },
            {
              key: "updated",
              header: "Mis a jour",
              className: "min-w-[150px]",
              render: (product) => (
                <span className="text-muted-foreground">{formatDate(product.updatedAt)}</span>
              ),
            },
            {
              key: "actions",
              header: "Actions",
              className: "min-w-[330px] text-right",
              render: (product) => (
                <div className="app-action-row justify-end">
                  {canManage ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openImagesDialog(product)}
                      >
                        <ImagePlus className="mr-2 h-4 w-4" />
                        Images
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={deactivatingProductId === product.id}
                        onClick={() => void handleDeactivateProduct(product)}
                      >
                        {deactivatingProductId === product.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Desactiver
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openImagesDialog(product)}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Voir images
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? editingProduct.name : "Catalogue de l'entreprise"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(event) => void handleSaveProduct(event)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5 text-sm font-semibold">
                Nom *
                <Input
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Nom du produit"
                />
              </label>

              <label className="space-y-1.5 text-sm font-semibold">
                Categorie
                <Input
                  value={form.category}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, category: event.target.value }))
                  }
                  placeholder="Ex: Chaussures"
                />
              </label>

              <label className="space-y-1.5 text-sm font-semibold">
                Prix
                <Input
                  type="number"
                  min="0"
                  step="0.001"
                  value={form.price}
                  onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                  placeholder="0.000"
                />
              </label>

              <label className="space-y-1.5 text-sm font-semibold">
                Devise
                <Input
                  value={form.currency}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, currency: event.target.value.toUpperCase() }))
                  }
                  placeholder="TND"
                  maxLength={3}
                />
              </label>

              <label className="space-y-1.5 text-sm font-semibold">
                Statut
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, status: value as ProductStatus }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Actif</SelectItem>
                    <SelectItem value="INACTIVE">Inactif</SelectItem>
                    <SelectItem value="ARCHIVED">Archive</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <label className="space-y-1.5 text-sm font-semibold">
                Disponibilite
                <Select
                  value={form.isAvailable ? "yes" : "no"}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, isAvailable: value === "yes" }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Disponibilite" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Disponible</SelectItem>
                    <SelectItem value="no">Indisponible</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>

            <label className="block space-y-1.5 text-sm font-semibold">
              Description
              <Textarea
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                placeholder="Description courte du produit"
                className="min-h-24"
              />
            </label>

            <label className="block space-y-1.5 text-sm font-semibold">
              Mots-cles
              <Input
                value={form.keywords}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, keywords: event.target.value }))
                }
                placeholder="reference, couleur, taille"
              />
            </label>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PackageCheck className="mr-2 h-4 w-4" />
                )}
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(imageProduct)}
        onOpenChange={(open) => {
          if (!open) {
            setImageProduct(null);
            setImageInputMode("file");
            setImageFile(null);
            setImageUrl("");
            setImageAltText("");
            if (imageFileInputRef.current) {
              imageFileInputRef.current.value = "";
            }
          }
        }}
      >
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Images produit</DialogTitle>
            <DialogDescription>{imageProduct?.name ?? ""}</DialogDescription>
          </DialogHeader>

          {imageProduct ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(imageProduct.images ?? []).length > 0 ? (
                  imageProduct.images.map((image) => (
                    <div
                      key={image.id}
                      className="overflow-hidden rounded-xl border border-border/70 bg-muted/20"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.imageUrl}
                        alt={image.altText || imageProduct.name}
                        className="aspect-video w-full object-cover"
                      />
                      <div className="flex items-center justify-between gap-3 px-3 py-2">
                        <p className="min-w-0 truncate text-xs text-muted-foreground">
                          {image.altText || "Image produit"}
                        </p>
                        {canManage ? (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon-sm"
                            aria-label="Supprimer l'image"
                            disabled={deletingImageId === image.id}
                            onClick={() => void handleDeleteImage(imageProduct, image.id)}
                          >
                            {deletingImageId === image.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-center">
                    <ImageIcon className="mb-2 h-6 w-6 text-muted-foreground" />
                    <p className="text-sm font-medium">Aucune image</p>
                  </div>
                )}
              </div>

              {canManage ? (
                <form
                  onSubmit={(event) => void handleAddImage(event)}
                  className="grid gap-3 rounded-xl border border-border/70 bg-muted/20 p-3 md:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)_auto]"
                >
                  <Select
                    value={imageInputMode}
                    onValueChange={(value) => {
                      setImageInputMode(value as ProductImageInputMode);
                      setError(null);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="file">Fichier local</SelectItem>
                      <SelectItem value="url">URL image</SelectItem>
                    </SelectContent>
                  </Select>

                  {imageInputMode === "file" ? (
                    <label className="min-w-0">
                      <span className="sr-only">Fichier image</span>
                      <Input
                        ref={imageFileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif,image/heic,image/heif"
                        onChange={(event) =>
                          setImageFile(event.target.files?.[0] ?? null)
                        }
                      />
                    </label>
                  ) : (
                    <Input
                      value={imageUrl}
                      onChange={(event) => setImageUrl(event.target.value)}
                      placeholder="URL image"
                    />
                  )}

                  <Input
                    value={imageAltText}
                    onChange={(event) => setImageAltText(event.target.value)}
                    placeholder="Texte alternatif"
                  />
                  <Button type="submit" disabled={isImageSubmitting}>
                    {isImageSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : imageInputMode === "file" ? (
                      <Upload className="mr-2 h-4 w-4" />
                    ) : (
                      <ImagePlus className="mr-2 h-4 w-4" />
                    )}
                    Ajouter
                  </Button>
                </form>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
