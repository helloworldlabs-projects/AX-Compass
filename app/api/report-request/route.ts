import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { institutionName } = await request.json();

    if (!institutionName) {
      return NextResponse.json({ error: '필수 필드를 모두 입력해주세요.' }, { status: 400 });
    }

    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('SLACK_WEBHOOK_URL is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const requestedAt = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    const payload = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '📊 AX 역량 리포트 신청이 접수되었습니다!',
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*🏢 기업명:*\n${institutionName}` },
            { type: 'mrkdwn', text: `*🕐 신청 시각:*\n${requestedAt}` },
          ],
        },
        { type: 'divider' },
      ],
    };

    const slackRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!slackRes.ok) {
      throw new Error(`Slack API error: ${slackRes.statusText}`);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('리포트 신청 오류:', error);
    return NextResponse.json(
      { error: '리포트 신청 중 오류가 발생했습니다. 나중에 다시 시도해주세요.' },
      { status: 500 },
    );
  }
}
