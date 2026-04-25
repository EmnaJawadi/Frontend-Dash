"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { superAdminService } from "@/src/features/super-admin/services/super-admin.service";
import type {
  CompanyRegistrationRequestItem,
  SuperAdminNotificationItem,
} from "@/src/features/super-admin/types/super-admin.types";

function formatDate(dateValue: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

function resolveError(error: unknown): string {
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

export default function AdminRegistrationRequestsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [requests, setRequests] = useState<CompanyRegistrationRequestItem[]>([]);
  const [notifications, setNotifications] = useState<SuperAdminNotificationItem[]>(
    [],
  );

  async function loadData() {
    setIsLoading(true);
    setError("");

    try {
      const [nextRequests, nextNotifications] = await Promise.all([
        superAdminService.getCompanyRegistrationRequests(),
        superAdminService.getCompanyRegistrationNotifications(100),
      ]);

      setRequests(nextRequests);
      setNotifications(nextNotifications);
    } catch (loadError) {
      setError(resolveError(loadError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const requestStats = useMemo(() => {
    const pending = requests.filter(
      (request) =>
        request.status === "PENDING_APPROVAL" ||
        request.status === "NEEDS_MORE_INFO",
    ).length;
    const approved = requests.filter(
      (request) => request.status === "APPROVED",
    ).length;
    const rejected = requests.filter(
      (request) => request.status === "REJECTED",
    ).length;

    return { pending, approved, rejected };
  }, [requests]);

  async function approveRequest(requestId: string) {
    try {
      await superAdminService.approveCompanyRegistrationRequest(requestId);
      setFeedback("Demande approuvee.");
      await loadData();
    } catch (taskError) {
      setError(resolveError(taskError));
      setFeedback("");
    }
  }

  async function rejectRequest(requestId: string) {
    const reason = window.prompt("Motif de rejet (optionnel):") ?? "";

    try {
      await superAdminService.rejectCompanyRegistrationRequest(requestId, reason);
      setFeedback("Demande rejetee.");
      await loadData();
    } catch (taskError) {
      setError(resolveError(taskError));
      setFeedback("");
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Chargement des demandes d inscription...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedback ? (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          {feedback}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-slate-500">En attente</p>
              <p className="text-2xl font-semibold">{requestStats.pending}</p>
            </div>
            <Clock3 className="h-5 w-5 text-amber-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-slate-500">Approuvees</p>
              <p className="text-2xl font-semibold">{requestStats.approved}</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-slate-500">Rejetees</p>
              <p className="text-2xl font-semibold">{requestStats.rejected}</p>
            </div>
            <XCircle className="h-5 w-5 text-red-600" />
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <BellRing className="h-4 w-4" />
            <h2 className="text-lg font-semibold">
              Notifications inscriptions entreprises
            </h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-500">
                Aucune notification de demande d inscription.
              </p>
            ) : (
              notifications.slice(0, 20).map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900">
                      {notification.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{notification.priority}</Badge>
                      <Badge variant="secondary">
                        {notification.isRead ? "READ" : "UNREAD"}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{notification.message}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Demandes d inscription</h2>
            <Button variant="outline" onClick={() => void loadData()}>
              Rafraichir
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {requests.length === 0 ? (
              <p className="text-sm text-slate-500">
                Aucune demande d inscription.
              </p>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="grid gap-2 md:grid-cols-2">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium text-slate-900">Demandeur:</span>{" "}
                      {request.responsibleFullName}
                    </p>
                    <p className="text-sm text-slate-700">
                      <span className="font-medium text-slate-900">Email:</span>{" "}
                      {request.businessEmail}
                    </p>
                    <p className="text-sm text-slate-700">
                      <span className="font-medium text-slate-900">Entreprise:</span>{" "}
                      {request.companyName}
                    </p>
                    <p className="text-sm text-slate-700">
                      <span className="font-medium text-slate-900">Date inscription:</span>{" "}
                      {formatDate(request.createdAt)}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{request.status}</Badge>
                    {request.rejectionReason ? (
                      <Badge variant="secondary">
                        Motif rejet: {request.rejectionReason}
                      </Badge>
                    ) : null}
                  </div>

                  {request.status === "PENDING_APPROVAL" ||
                  request.status === "NEEDS_MORE_INFO" ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => void approveRequest(request.id)}
                      >
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => void rejectRequest(request.id)}
                      >
                        Refuser
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
