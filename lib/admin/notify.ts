/**
 * 운영체제 알림.
 *
 * 브라우저 밖으로 뜨는 그 알림이다. 담당자가 다른 창을 보고 있어도 눈에
 * 들어온다는 것이 장점이다.
 *
 * 다만 늘 뜨지는 않는다.
 *   · 권한을 묻지 않았으면(`default`) 그 자리에서 물어본다.
 *   · 한 번 거절했으면(`denied`) 다시 물을 수 없다. 브라우저 주소창의
 *     자물쇠에서 사람이 직접 풀어 주어야 한다.
 *   · `http://192.168.…` 처럼 보안 컨텍스트가 아닌 주소에서는 브라우저가
 *     막는 경우가 있다.
 *
 * 그래서 **떴는지 여부를 돌려준다.** 부르는 쪽은 뜨지 않았을 때 화면 안에
 * 대신 알린다 — 알림이 막혔다고 아무 말도 없이 끝나면 담당자는 복사가 된
 * 것인지 알 수 없다.
 */
export async function notify(title: string, body: string): Promise<boolean> {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') {
    return false;
  }

  try {
    if (Notification.permission === 'default') {
      // 묻는 동안 기다린다. 처음 한 번뿐이다.
      await Notification.requestPermission();
    }
    if (Notification.permission !== 'granted') return false;

    new Notification(title, { body, icon: '/favicon.ico' });
    return true;
  } catch {
    return false;
  }
}
