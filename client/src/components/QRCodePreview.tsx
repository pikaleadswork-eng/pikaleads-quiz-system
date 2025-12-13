import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface QRCodePreviewProps {
  quizUrl: string;
  quizName: string;
}

export default function QRCodePreview({ quizUrl, quizName }: QRCodePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (canvasRef.current && quizUrl) {
      QRCode.toCanvas(canvasRef.current, quizUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      }).catch((err) => {
        console.error("Failed to generate QR code:", err);
      });
    }
  }, [quizUrl]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${quizName}-qr-code.png`;
      link.href = url;
      link.click();
      toast.success("QR code downloaded!");
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(quizUrl);
    toast.success("URL copied to clipboard!");
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="gap-2"
      >
        <QrCode className="h-4 w-4" />
        Show QR Code
      </Button>
    );
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          Mobile Preview
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
        >
          ×
        </Button>
      </div>

      <div className="flex flex-col items-center gap-3">
        <canvas ref={canvasRef} className="border rounded-lg" />
        
        <p className="text-xs text-muted-foreground text-center max-w-[200px]">
          Scan this QR code with your phone to test the quiz on mobile
        </p>

        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex-1 gap-2"
          >
            <Download className="h-3 w-3" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyUrl}
            className="flex-1 gap-2"
          >
            <ExternalLink className="h-3 w-3" />
            Copy URL
          </Button>
        </div>

        <div className="text-xs text-muted-foreground break-all max-w-[200px] text-center">
          {quizUrl}
        </div>
      </div>
    </Card>
  );
}
