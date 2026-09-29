/**
 * 글자를 클립보드에 넣는다.
 *
 * `navigator.clipboard` 는 **보안 컨텍스트에서만** 있다. https 와 localhost 가
 * 거기에 들고, 사내에서 서로 보여줄 때 쓰는 `http://192.168.x.x` 는 들지
 * 않는다. 그 주소로 열면 clipboard 가 통째로 없어서, 담당자가 링크 복사를
 * 눌러도 복사가 되지 않는다.
 *
 * 그래서 없으면 예전 방식(execCommand)으로 복사한다. 낡은 방법이지만 보안
 * 컨텍스트를 따지지 않아 사내 IP 에서도 그대로 동작한다.
 *
 * 복사했는지 여부를 돌려준다. 부르는 쪽은 그 결과로 안내를 띄운다 —
 * 창을 띄워 "직접 복사하세요" 라고 하지 않는다. 누른 사람이 바라는 것은
 * 복사이지, 복사할 기회가 아니다.
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // 권한이 막혔을 수 있다. 아래 방식으로 한 번 더 해 본다.
    }
  }

  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    // 화면에 보이지 않으면서 선택은 되어야 한다. display:none 이면 선택이 안 된다.
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}
