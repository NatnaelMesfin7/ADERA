type ChatRole = "assistant" | "user";

export type AderaAiChatHistoryItem = {
  role: ChatRole;
  content: string;
};

export type AderaAiSupportedTokenContext = {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  canBeCollateral: boolean;
  canBeBorrowed: boolean;
  baseAprBps: string;
  aprFloorBps: string;
};

export type AderaAiSuppliedTokenContext = {
  symbol: string;
  assetAddress: string;
  lendTokenAddress: string;
  amountRaw: string;
  amountFormatted: string;
};

export type AderaAiBorrowedLoanContext = {
  loanId: string;
  borrowSymbol: string;
  borrowAssetAddress: string;
  principalRaw: string;
  principalFormatted: string;
  collateralSymbol: string;
  collateralAssetAddress: string;
  collateralRaw: string;
  collateralFormatted: string;
  aprBps: string;
  aprPercent: string;
  active: boolean;
};

export type AderaAiChatPayload = {
  message: string;
  history: AderaAiChatHistoryItem[];
  wallet: {
    isConnected: boolean;
    address: string | null;
  };
  context: {
    suppliedTokens: AderaAiSuppliedTokenContext[];
    borrowedLoans: AderaAiBorrowedLoanContext[];
    supportedTokens: AderaAiSupportedTokenContext[];
    protocol: {
      name: "ADERA Finance";
      chain: "Moonbase Alpha";
      lendingModel: "Overcollateralized lending";
      aprModel: "Credit-aware APR where borrower quality can influence borrowing rate around asset base APR and APR floor.";
    };
  };
};

export type AiChatResult = {
  answer: string;
  model: string;
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  modelVersion?: string;
  promptFeedback?: {
    blockReason?: string;
  };
};

const getModel = (): string =>
  process.env.GEMINI_MODEL || "gemini-3.1-flash-lite-preview";

const SYSTEM_PROMPT = [
  "You are ADERA's DeFi assistant.",
  "Answer mostly using ONLY the supplied request data.",
  "Keep responses concise, direct, and practical.",
  "Hard constraints:",
  "- Maximum 120 words.",
  "- No preamble, no small talk, no markdown tables.",
  "- If calculations are needed, show short reasoning and final numbers only.",
].join("\n");

const getGeminiApiKey = (): string => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }

  return apiKey;
};

export const askAderaAssistant = async (
  context: AderaAiChatPayload,
): Promise<AiChatResult> => {
  const apiKey = getGeminiApiKey();
  const model = getModel();
  const endpoint = new URL(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
  );
  endpoint.searchParams.set("key", apiKey);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: JSON.stringify(context) }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 240,
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gemini request failed (${response.status} ${response.statusText}): ${errorText}`,
    );
  }

  const responseBody = (await response.json()) as GeminiGenerateContentResponse;
  const answer = responseBody.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!answer) {
    const blockReason = responseBody.promptFeedback?.blockReason;
    throw new Error(
      blockReason
        ? `Gemini response blocked: ${blockReason}`
        : "Gemini response did not include output text.",
    );
  }

  return {
    answer,
    model: responseBody.modelVersion || model,
  };
};
