import { useEffect, useState } from "react";
import { Check, Link, MessageCircle } from "lucide-react";

const invitationUrl = "https://hwajinyu.silee.net/";
const shareKey = import.meta.env.VITE_KAKAO_SHARE_JS_KEY || import.meta.env.VITE_KAKAO_MAP_JS_KEY;
const link = { webUrl: invitationUrl, mobileWebUrl: invitationUrl };
const shareTemplate = {
  objectType: "feed" as const,
  content: {
    title: "이세인 ♥ 유화진 결혼합니다",
    description: "2027년 1월 16일 토요일 오전 11시",
    imageUrl: `${invitationUrl}og-image.jpg?v=20261013`,
    imageWidth: 2160,
    imageHeight: 2700,
    link,
  },
  buttons: [{ title: "청첩장 보기", link }],
};

type KakaoShareSdk = {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Share: { sendDefault: (template: typeof shareTemplate) => void };
};

declare global {
  interface Window {
    Kakao?: KakaoShareSdk;
  }
}

let sdkPromise: Promise<KakaoShareSdk> | null = null;

function loadShareSdk() {
  if (!shareKey) return Promise.reject(new Error("Missing Kakao JavaScript key"));
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<KakaoShareSdk>((resolve, reject) => {
    const initialize = () => {
      try {
        const sdk = window.Kakao;
        if (!sdk) throw new Error("Kakao SDK unavailable");
        if (!sdk.isInitialized()) sdk.init(shareKey);
        resolve(sdk);
      } catch (error) {
        reject(error);
      }
    };

    if (window.Kakao) {
      initialize();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js";
    script.integrity = "sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy";
    script.crossOrigin = "anonymous";
    script.async = true;
    script.onload = initialize;
    script.onerror = () => {
      script.remove();
      reject(new Error("Could not load Kakao SDK"));
    };
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    sdkPromise = null;
    throw error;
  });

  return sdkPromise;
}

type ShareSectionProps = {
  debugClass?: string;
};

export default function ShareSection({ debugClass = "" }: ShareSectionProps) {
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    // Load before the click so mobile sharing keeps the user's activation.
    void loadShareSdk().then(() => {
      if (active) setReady(true);
    }).catch(() => {
      if (active) setMessage("카카오톡 공유를 사용할 수 없습니다. 링크 복사를 이용해주세요.");
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const share = () => {
    try {
      if (!window.Kakao?.isInitialized()) throw new Error("Kakao SDK is not ready");
      setMessage("");
      window.Kakao.Share.sendDefault(shareTemplate);
    } catch {
      setMessage("카카오톡 공유를 열지 못했습니다. 링크 복사를 이용해주세요.");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      setCopied(true);
      setMessage("링크를 복사했습니다.");
    } catch {
      setMessage("링크를 길게 눌러 복사해주세요.");
    }
  };

  return (
    <section className={`px-6 py-10 bg-[#fcfcfc] ${debugClass}`}>
      <div className="max-w-[382px] mx-auto flex flex-col gap-3">
        <button
          type="button"
          onClick={share}
          disabled={!ready}
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[#fee500] text-sm text-[#191919] transition-colors hover:bg-[#f5dc00] disabled:opacity-50"
        >
          <MessageCircle size={18} fill="currentColor" aria-hidden="true" />
          카카오톡 공유
        </button>
        <button
          type="button"
          onClick={() => { void copyLink(); }}
          className="flex h-12 items-center justify-center gap-2 rounded-lg border border-[#e5e5e5] bg-white text-sm text-[#555] hover:bg-[#f5f5f5]"
        >
          {copied ? <Check size={18} aria-hidden="true" /> : <Link size={18} aria-hidden="true" />}
          {copied ? "복사 완료" : "링크 복사"}
        </button>
        <p role="status" className="min-h-5 text-center text-xs leading-5 text-[#777]">{message}</p>
        {message === "링크를 길게 눌러 복사해주세요." && (
          <a href={invitationUrl} className="break-all text-center text-sm underline">{invitationUrl}</a>
        )}
      </div>
    </section>
  );
}
