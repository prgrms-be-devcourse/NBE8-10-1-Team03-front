/**
 * 서버가 주는 "image byte code"가 뭔지 애매하니,
 * 아래 2가지를 모두 처리:
 * 1) base64 string (가장 흔함)
 * 2) number[] (byte array)
 *
 * 반환은 브라우저에서 바로 표시 가능한 data URL.
 *
 * mimeType은 서버가 jpeg/png를 섞어줄 수 있으면 같이 내려주는 게 제일 좋고,
 * 지금은 기본값을 image/jpeg로 둠.
 */
export function toDataUrl(
  raw: unknown,
  mimeType: string = "image/jpeg"
): string | null {
  if (!raw) return null;

  // (1) base64 문자열
  if (typeof raw === "string") {
    // 이미 dataURL 형태면 그대로
    if (raw.startsWith("data:image/")) return raw;
    return `data:${mimeType};base64,${raw}`;
  }

  // (2) byte array
  if (Array.isArray(raw) && raw.every((v) => typeof v === "number")) {
    const bytes = new Uint8Array(raw as number[]);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const base64 = btoa(binary);
    return `data:${mimeType};base64,${base64}`;
  }

  return null;
}
