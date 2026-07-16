"use client";

import { useRef, useCallback } from "react";
import { Download, RotateCcw } from "lucide-react";
import { BRAND_NAME } from "@/config/brand";
import { useLedger } from "@/hooks/useLedger";
import ReadinessScoreTable from "./ReadinessScoreTable";

// Dynamically import html2canvas and jsPDF only on client
let html2canvas: typeof import("html2canvas-pro").default | null = null;
let jsPDF: typeof import("jspdf").jsPDF | null = null;

if (typeof window !== "undefined") {
  import("html2canvas-pro").then((mod) => {
    html2canvas = mod.default;
  });
  import("jspdf").then((mod) => {
    jsPDF = mod.jsPDF;
  });
}

interface CategoryScore {
  category: string;
  score: number;
}

interface CertificateData {
  name: string;
  uniqueId: string;
  issueDate: string;
  scores: CategoryScore[];
}

interface CertificateCardProps {
  data: CertificateData;
}

export default function CertificateCard({ data }: CertificateCardProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { resetApp } = useLedger();

  const handleDownload = useCallback(async () => {
    if (!certificateRef.current || !html2canvas || !jsPDF) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: "#F5EFE3",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`marriage-readiness-report-${data.uniqueId}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  }, [data.uniqueId]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: "My Marriage Readiness Report",
      text: `I completed my Marriage Readiness Reflection with ${BRAND_NAME}.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch {
        // Clipboard failed
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Certificate */}
      <div
        ref={certificateRef}
        className="bg-[var(--color-sand-light)] border-2 border-[var(--color-gold)]/30 rounded-[var(--radius-card)] p-8 text-center shadow-sm"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-[var(--color-ink)] mb-1">
            {BRAND_NAME}
          </h2>
        </div>

        <p className="text-sm text-[var(--color-stone)] uppercase tracking-widest mb-6">
          Certificate of Reflection
        </p>

        {/* Recipient */}
        <h3 className="text-2xl font-semibold text-[var(--color-ink)] mb-2">
          {data.name}
        </h3>
        <p className="text-sm text-[var(--color-slate)] mb-6 font-sans">
          Has completed the Marriage Readiness Reflection
        </p>

        {/* Scores */}
        <div className="mb-6 text-left">
          <ReadinessScoreTable scores={data.scores} minimal={true} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-8 text-xs text-[var(--color-stone)] mt-6">
          <div>
            <p className="font-medium uppercase tracking-wider text-[10px]">Verification ID</p>
            <p className="font-mono text-[var(--color-ink)] mt-0.5">{data.uniqueId}</p>
          </div>
          <div>
            <p className="font-medium uppercase tracking-wider text-[10px]">Issue Date</p>
            <p className="text-[var(--color-ink)] mt-0.5">{data.issueDate}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleDownload}
          className="btn btn-primary cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button
          onClick={resetApp}
          className="btn btn-danger cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Start New Reflection
        </button>
      </div>
    </div>
  );
}

export type { CertificateData };
