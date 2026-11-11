export type SseEvent = { event: string; data: string };

// Server-Sent Events 파서. 네트워크 청크가 줄이나 이벤트 중간에서 끊겨도 이어 붙여 처리한다.
// 빈 줄이 이벤트 끝이고, event:/data: 줄만 읽는다(data가 여러 줄이면 \n으로 이어 붙임). 주석(:)과 모르는 필드는 무시한다.
export function createSseParser(onEvent: (event: SseEvent) => void) {
  let buffer = '';
  let eventName = '';
  let dataLines: string[] = [];

  const dispatch = () => {
    if (dataLines.length > 0) onEvent({ event: eventName || 'message', data: dataLines.join('\n') });
    eventName = '';
    dataLines = [];
  };

  const processLine = (line: string) => {
    if (line === '') {
      dispatch();
      return;
    }
    if (line.startsWith(':')) return;
    const colon = line.indexOf(':');
    const field = colon === -1 ? line : line.slice(0, colon);
    let value = colon === -1 ? '' : line.slice(colon + 1);
    if (value.startsWith(' ')) value = value.slice(1);
    if (field === 'event') eventName = value;
    else if (field === 'data') dataLines.push(value);
  };

  return {
    push(chunk: string) {
      buffer += chunk;
      // 줄 끝이 \r로 끝난 청크는 다음 청크의 \n과 한 줄바꿈일 수 있어 마지막 \r은 남겨 둔다.
      const hold = buffer.endsWith('\r') ? 1 : 0;
      const ready = buffer.slice(0, buffer.length - hold);
      const lines = ready.split(/\r\n|\n|\r/);
      buffer = lines.pop() + buffer.slice(buffer.length - hold);
      for (const line of lines) processLine(line);
    },
    // 스트림이 끝났을 때 남은 줄과 이벤트를 처리한다.
    flush() {
      if (buffer !== '') processLine(buffer.replace(/\r$/, ''));
      buffer = '';
      dispatch();
    },
  };
}
