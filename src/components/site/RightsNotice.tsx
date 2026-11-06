import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

/** A copyright notice, not a security boundary or a DevTools detector. */
export function RightsNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => setVisible(true);
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const modifier = event.ctrlKey || event.metaKey;
      if (key === "f12" || (modifier && key === "u") ||
        (modifier && event.shiftKey && ["i", "j", "c"].includes(key)) ||
        (event.metaKey && event.altKey && ["i", "j", "c", "u"].includes(key))) {
        show();
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("contextmenu", show);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("contextmenu", show);
    };
  }, []);

  if (!visible) return null;
  return (
    <aside aria-label="Direitos reservados" className="border-b border-border bg-background px-4 py-3 text-foreground">
      <div className="container-page flex items-center justify-between gap-4">
        <p role="status" className="text-sm">Gás Brasil. Todos os direitos reservados. A inspeção da página não concede autorização para reproduzir seu conteúdo.</p>
        <Button variant="ghost" size="icon" aria-label="Fechar aviso de direitos" onClick={() => setVisible(false)} className="shrink-0"><X aria-hidden="true" /></Button>
      </div>
    </aside>
  );
}