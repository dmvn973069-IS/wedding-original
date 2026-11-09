"use client";

import { useEffect, useRef } from "react";

export default function MusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5;

    const events = ["pointerdown", "touchend", "click", "keydown"];

    const removeListeners = () =>
      events.forEach((e) => document.removeEventListener(e, start));

    // Thử phát; nếu thành công thì gỡ sự kiện, nếu bị chặn thì chờ lần chạm sau
    function start() {
      audio!
        .play()
        .then(removeListeners)
        .catch(() => {});
    }

    start(); // thử tự phát ngay khi mở trang (đa số trình duyệt sẽ chặn)
    events.forEach((e) => document.addEventListener(e, start));

    // Tạm dừng khi khách chuyển tab hoặc khóa màn hình, phát lại khi quay về
    const onVisibility = () => {
      if (document.hidden) audio.pause();
      else if (audio.currentTime > 0) audio.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      removeListeners();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <audio ref={audioRef} src={src} loop preload="auto" />;
}
