"use client";

import { useRef, useState, useEffect } from "react";

interface EditorSwingProps {
  value?: string;
  maxLength?: number;
  onChange?: (value: string) => void;
}

export function EditorSwing({
  value = "",
  maxLength = 250,
  onChange,
}: EditorSwingProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [charCount, setCharCount] = useState(
    value.replace(/<[^>]*>/g, "").length
  );

  // 🧹 Mantém apenas <p> e <b>, e limpa &nbsp; excessivos
  const sanitizeHTML = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    const walk = (node: ChildNode) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;

        if (!["B", "P"].includes(el.tagName)) {
          const parent = el.parentNode;
          while (el.firstChild) parent?.insertBefore(el.firstChild, el);
          parent?.removeChild(el);
        } else {
          // Parágrafo vazio → &nbsp;
          if (el.tagName === "P" && !el.textContent?.trim()) {
            el.innerHTML = "&nbsp;";
          }
          Array.from(el.childNodes).forEach(walk);
        }
      }
    };

    Array.from(temp.childNodes).forEach(walk);

    let cleanHTML = temp.innerHTML;

    // 🔹 Remove &nbsp; entre palavras, mas mantém <p>&nbsp;</p>
    cleanHTML = cleanHTML.replace(/&(nbsp|#160);(?!<\/p>)/g, " ");

    return cleanHTML;
  };

  // Inicializa o editor
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = sanitizeHTML(value);
      setCharCount(editorRef.current.innerText.length);
    }
  }, [value]);

  // Atualiza conteúdo
  const handleInput = () => {
    if (!editorRef.current) return;

    const sanitized = sanitizeHTML(editorRef.current.innerHTML);
    editorRef.current.innerHTML = sanitized;

    setCharCount(
      editorRef.current.innerText.length > maxLength
        ? maxLength
        : editorRef.current.innerText.length
    );

    onChange?.(sanitized);
    placeCursorAtEnd(editorRef.current);
  };

  // Posiciona o cursor no fim
  const placeCursorAtEnd = (el: HTMLDivElement) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  // Cola texto puro
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    handleInput();
  };

  // Negrito
  const execCommand = (command: "bold") => {
    document.execCommand(command, false);
    handleInput();
  };

  // Enter cria novo parágrafo limpo
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const sel = window.getSelection();
      if (!sel?.rangeCount) return;

      const range = sel.getRangeAt(0);
      range.deleteContents();

      const p = document.createElement("p");
      p.innerHTML = "&nbsp;"; // cria parágrafo visível

      range.insertNode(p);

      // Move o cursor dentro do novo parágrafo
      const newRange = document.createRange();
      newRange.selectNodeContents(p);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);

      handleInput();
    }
  };

  return (
    <div className="relative border border-gray-300 rounded p-2 bg-white">
      {/* Barra de formatação */}
      <div className="mb-4 border-b border-gray-200">
        <button
          type="button"
          className="px-2 py-1 text-sm font-bold"
          onClick={() => execCommand("bold")}
        >
          B
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[100px] outline-none whitespace-pre-wrap break-words"
        style={{ margin: 0, padding: 0, lineHeight: "1.4" }}
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning
      />

      {/* Contador de caracteres */}
      <div className="text-right text-xs text-gray-500 mt-1">
        {charCount}/{maxLength}
      </div>
    </div>
  );
}
