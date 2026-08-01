import { Fetch, Post } from "@/hooks/apiUtils";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  categoryName?: string;
};

export type KnowledgeType =
  | "blog"
  | "article"
  | "video"
  | "product_info"
  | "tutorial";

export type KnowledgeItem = {
  _id?: string;
  title?: string;
  slug?: string;
  type?: KnowledgeType;
  summary?: string;
  content?: string;
  coverImageUrl?: string;
  linkUrl?: string;
  tags?: string[];
  publishedAt?: string;
};

export type SupportTicket = {
  id: string;
  title: string;
  status: string;
  priority?: string;
  tags?: string[];
  assigneeId?: string;
  assigneeName?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SupportInteraction = {
  id: string;
  content: string;
  senderId?: string;
  createdAt: string;
  attachments?: Array<{
    url: string;
    type?: string;
    name?: string;
    size?: number;
    mimetype?: string;
  }>;
};

export type SupportTicketDetail = SupportTicket & {
  assignee?: {
    id?: string;
    name?: string;
    email?: string;
    mobile?: string;
  };
  requester?: {
    id?: string;
    name?: string;
    email?: string;
    mobile?: string;
  };
  interactions?: SupportInteraction[];
};

export const SUPPORT_TICKET_CATEGORIES = [
  { value: "app_support", label: "Application support" },
  {
    value: "document_verification_support",
    label: "Document verification",
  },
  { value: "payment_emi_support", label: "Payment or EMI" },
  { value: "credit_score_support", label: "Credit score" },
  { value: "insurance_support", label: "Insurance" },
  { value: "account_access_support", label: "Account access" },
  { value: "grievance_support", label: "Grievance" },
] as const;

const unwrap = (response: unknown) => {
  const value = response as Record<string, unknown>;
  const data = value?.data as Record<string, unknown> | unknown[] | undefined;
  const nested = data as Record<string, unknown> | undefined;
  return nested?.result || data || value?.result || response;
};

const mapFaq = (item: Record<string, unknown>): FaqItem => ({
  id: String(item?._id || item?.id || item?.question || "faq"),
  question: String(item?.question || ""),
  answer: String(item?.answer || ""),
  categoryName: item?.categoryName ? String(item.categoryName) : undefined,
});

const mapTicket = (item: Record<string, unknown>): SupportTicket => ({
  id: String(item?._id || item?.id || item?.title || "ticket"),
  title: String(item?.title || "Ticket"),
  status: String(item?.status || "open"),
  priority: item?.priority ? String(item.priority) : undefined,
  tags: Array.isArray(item?.tags) ? (item.tags as string[]) : [],
  assigneeId:
    item?.assigneeId ||
    (item?.assignee as Record<string, unknown> | undefined)?._id ||
    (item?.assignee as Record<string, unknown> | undefined)?.id
      ? String(
          item?.assigneeId ||
            (item?.assignee as Record<string, unknown> | undefined)?._id ||
            (item?.assignee as Record<string, unknown> | undefined)?.id,
        )
      : undefined,
  assigneeName:
    item?.assigneeName ||
    (item?.assignee as Record<string, unknown> | undefined)?.name
      ? String(
          item?.assigneeName ||
            (item?.assignee as Record<string, unknown> | undefined)?.name,
        )
      : undefined,
  createdAt: item?.createdAt ? String(item.createdAt) : undefined,
  updatedAt: item?.updatedAt ? String(item.updatedAt) : undefined,
});

const mapInteraction = (item: Record<string, unknown>): SupportInteraction => ({
  id: String(
    item?._id ||
      item?.id ||
      `${item?.initiator || item?.senderId || "user"}-${item?.timestamp || Date.now()}`,
  ),
  content: String(item?.content || item?.text || ""),
  senderId:
    item?.senderId ||
    (item?.initiator as Record<string, unknown> | undefined)?._id ||
    item?.initiator
      ? String(
          item?.senderId ||
            (item?.initiator as Record<string, unknown> | undefined)?._id ||
            item?.initiator,
        )
      : undefined,
  createdAt: String(
    item?.timestamp || item?.createdAt || new Date().toISOString(),
  ),
  attachments: Array.isArray(item?.attachments)
    ? (item.attachments as SupportInteraction["attachments"])
    : Array.isArray(item?.media)
      ? (item.media as SupportInteraction["attachments"])
      : [],
});

const mapTicketDetail = (
  item: Record<string, unknown>,
): SupportTicketDetail => {
  const assignee = item?.assignee as Record<string, unknown> | undefined;
  const requester = item?.requester as Record<string, unknown> | undefined;
  return {
    ...mapTicket(item),
    assignee: assignee
      ? {
          id:
            assignee?._id || assignee?.id
              ? String(assignee?._id || assignee?.id)
              : undefined,
          name: assignee?.name ? String(assignee.name) : undefined,
          email: assignee?.email ? String(assignee.email) : undefined,
          mobile: assignee?.mobile ? String(assignee.mobile) : undefined,
        }
      : undefined,
    requester: requester
      ? {
          id:
            requester?._id || requester?.id
              ? String(requester?._id || requester?.id)
              : undefined,
          name:
            requester?.fullName || requester?.name
              ? String(requester?.fullName || requester?.name)
              : undefined,
          email: requester?.email ? String(requester.email) : undefined,
          mobile: requester?.mobile ? String(requester.mobile) : undefined,
        }
      : undefined,
    interactions: Array.isArray(item?.interactions)
      ? (item.interactions as Record<string, unknown>[])
          .filter(
            (interaction) =>
              !interaction?.action || interaction.action === "commented",
          )
          .map(mapInteraction)
      : [],
  };
};

export const fetchFaqs = async (): Promise<FaqItem[]> => {
  const response = await Fetch<unknown>(
    "faq/public",
    undefined,
    10000,
    true,
    false,
  );
  const list = unwrap(response);
  return Array.isArray(list)
    ? list.map((item) => mapFaq(item as Record<string, unknown>))
    : [];
};

export const fetchKnowledge = async (
  type: KnowledgeType,
  limit = 5,
): Promise<KnowledgeItem[]> => {
  const response = await Fetch<unknown>(
    "knowledge",
    { type, limit },
    10000,
    true,
    false,
  );
  const list = unwrap(response);
  return Array.isArray(list) ? (list as KnowledgeItem[]) : [];
};

export const fetchTickets = async (): Promise<SupportTicket[]> => {
  const response = await Fetch<unknown>(
    "support/tickets",
    { limit: 5 },
    10000,
    true,
    false,
  );
  const list = unwrap(response);
  return Array.isArray(list)
    ? list.map((item) => mapTicket(item as Record<string, unknown>))
    : [];
};

export const createTicket = async (payload: {
  title: string;
  description: string;
  tags: string[];
  source?: string;
  platform?: string;
  sourcePlatform?: string;
  formSource?: string;
  whatsappConsent?: boolean;
  communicationConsent?: Record<string, unknown>;
}) => Post<unknown>("support/tickets", payload, 10000);

export const fetchTicketById = async (
  ticketId: string,
): Promise<SupportTicketDetail | null> => {
  if (!ticketId) return null;
  const response = await Fetch<unknown>(
    `support/tickets/${ticketId}`,
    undefined,
    10000,
    true,
    false,
  );
  const payload = unwrap(response) as Record<string, unknown>;
  const ticket =
    (payload?.data as Record<string, unknown> | undefined) || payload;
  return ticket ? mapTicketDetail(ticket) : null;
};

export const addTicketInteraction = async ({
  ticketId,
  content,
}: {
  ticketId: string;
  content: string;
}): Promise<SupportTicketDetail | null> => {
  const response = await Post<unknown>(
    "support/tickets/interactions",
    {
      ticketId,
      content,
      action: "commented",
    },
    10000,
  );
  const payload = unwrap(response) as Record<string, unknown>;
  const ticket =
    (payload?.data as Record<string, unknown> | undefined) || payload;
  return ticket ? mapTicketDetail(ticket) : null;
};
