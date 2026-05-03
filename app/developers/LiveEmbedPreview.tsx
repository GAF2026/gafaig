"use client";

import { useEffect, useRef, useState } from "react";

const REGISTRY_ID = "GAFAIG-00000001";
const BASE_URL = "https://www.gafaig.com";

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return resolve();

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export default function LiveEmbedPreview() {
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState("Loading live GAFAIG preview…");

  useEffect(() => {
    async function run() {
      try {
        await loadScript(`${BASE_URL}/sdk/gafaig.v1.js`);
        await loadScript(`${BASE_URL}/widget/gafaig-widget.v1.js`);
        await loadScript(`${BASE_URL}/widget/gafaig-verify.v1.js`);

        const w = window as any;

        if (w.gafaig && typeof w.gafaig.verify !== "function") {
          w.gafaig.verify = async function (registryId: string) {
            const res = await fetch(
              `${BASE_URL}/api/verify/${encodeURIComponent(registryId)}`,
              { cache: "no-store" }
            );
            return res.json();
          };
        }

        if (badgeRef.current && w.gafaig?.badge) {
          await w.gafaig.badge(badgeRef.current, {
            registryId: REGISTRY_ID,
            baseUrl: BASE_URL,
          });
        }

        if (widgetRef.current) {
          widgetRef.current.setAttribute("data-gafaig-id", REGISTRY_ID);
          if (w.GAFAIGWidget?.mount) {
            w.GAFAIGWidget.mount();
          }
        }

        setStatus("Live preview loaded.");
      } catch (error) {
        setStatus(
          error instanceof Error
            ? error.message
            : "Live preview could not be loaded."
        );
      }
    }

    run();
  }, []);

  function openModal() {
    const w = window as any;
    if (typeof w.verifyGAFAIG === "function") {
      w.verifyGAFAIG(REGISTRY_ID, { baseUrl: BASE_URL });
    }
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-8">
      <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
        LIVE PREVIEW
      </div>

      <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
        See the versioned embed working live
      </h2>

      <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-black/75">
        This preview loads the production versioned SDK, badge, widget, and
        verification modal using GAFAIG-00000001.
      </p>

      <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-[13px] font-semibold text-black/60">
        {status}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
          <div className="text-[14px] font-semibold tracking-tight text-black">
            Live badge
          </div>
          <div className="mt-4" ref={badgeRef} />
        </div>

        <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
          <div className="text-[14px] font-semibold tracking-tight text-black">
            Live modal
          </div>
          <button
            type="button"
            onClick={openModal}
            className="mt-4 rounded-full border border-black/20 bg-white px-5 py-3 text-[13px] font-semibold text-black transition hover:bg-black hover:text-white"
          >
            Open verification modal
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
        <div className="mb-4 text-[14px] font-semibold tracking-tight text-black">
          Live widget
        </div>
        <div ref={widgetRef} />
      </div>
    </div>
  );
}