import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { company_name, contact_person, position, phone_number, email, inquiry_content } =
      await request.json();

    if (!company_name || !contact_person || !phone_number || !email || !inquiry_content) {
      return NextResponse.json({ error: '필수 필드를 모두 입력해주세요.' }, { status: 400 });
    }

    if (!/^\d{9,11}$/.test(phone_number)) {
      return NextResponse.json({ error: '숫자만 9~11자리로 입력해 주세요.' }, { status: 400 });
    }

    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('SLACK_WEBHOOK_URL is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const receivedAt = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    const payload = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '새로운 홈페이지 문의가 접수되었습니다!',
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*🏢 기업명:*\n${company_name}` },
            { type: 'mrkdwn', text: `*👤 담당자:*\n${contact_person}` },
            { type: 'mrkdwn', text: `*💼 직급:*\n${position || '-'}` },
            { type: 'mrkdwn', text: `*📞 전화번호:*\n${phone_number}` },
            { type: 'mrkdwn', text: `*✉️ 이메일:*\n${email}` },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*📝 문의내용:*\n\`\`\`${inquiry_content}\`\`\``,
          },
        },
        {
          type: 'context',
          elements: [{ type: 'mrkdwn', text: `접수 시각: ${receivedAt}` }],
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
    console.error('문의 등록 오류:', error);
    return NextResponse.json(
      { error: '문의 등록 중 오류가 발생했습니다. 나중에 다시 시도해주세요.' },
      { status: 500 },
    );
  }
}
