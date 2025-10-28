import { FormEvent, KeyboardEvent, useRef, useEffect } from "react";
import css from "./ChatInput.module.css";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void; // больше не передаем event
}

export default function ChatInput({
  input,
  setInput,
  handleSend,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(); // вызываем без any
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  return (
    <form className={css.inputWrapper} onSubmit={onSubmit}>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className={css.textarea}
        rows={1}
      />
      <button type="submit">Send</button>
    </form>
  );
}
