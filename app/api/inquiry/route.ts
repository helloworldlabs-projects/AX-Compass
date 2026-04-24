import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function buildEmailHtml(data: {
  company_name: string;
  contact_person: string;
  position: string;
  phone_number: string;
  email: string;
  inquiry_content: string;
}) {
  const receivedAt = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  const row = (label: string, value: string, last = false) => `
    <tr>
      <td style="padding:14px 20px;width:90px;font-size:12px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;border-bottom:${last ? 'none' : '1px solid #f3f4f6'};white-space:nowrap;">${label}</td>
      <td style="padding:14px 20px;font-size:14px;color:#111827;border-bottom:${last ? 'none' : '1px solid #f3f4f6'};white-space:pre-wrap;word-break:break-word;">${value}</td>
    </tr>`;

  return `
    <div style="background:#f3f4f6;padding:40px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:540px;margin:0 auto;">

        <div style="background:linear-gradient(135deg,#4b2e84 0%,#7c3aed 100%);border-radius:12px 12px 0 0;padding:28px 32px;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:rgba(255,255,255,0.5);letter-spacing:0.1em;text-transform:uppercase;">HelloworldLabs</p>
          <h1 style="margin:0;font-size:18px;font-weight:700;color:#fff;line-height:1.4;">새로운 문의가 접수되었습니다</h1>
          <p style="margin:8px 0 0;font-size:12px;color:rgba(255,255,255,0.4);">${receivedAt}</p>
        </div>

        <div style="background:#fff;border-radius:0 0 12px 12px;">
          <table style="width:100%;border-collapse:collapse;">
            <tbody>
              ${row('기업명', data.company_name)}
              ${row('담당자', data.contact_person)}
              ${row('직급', data.position || '—')}
              ${row('전화번호', data.phone_number)}
              ${row('이메일', data.email)}
              ${row('문의내용', data.inquiry_content, true)}
            </tbody>
          </table>
        </div>

        <p style="margin:20px 0 0;text-align:center;font-size:11px;color:#9ca3af;">
          헬로월드랩스 홈페이지 문의하기 폼에서 자동 발송된 메일입니다.
        </p>

      </div>
    </div>
  `;
}

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

    if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_TO) {
      try {
        await transporter.sendMail({
          from: `"헬로월드랩스 문의" <${process.env.SMTP_USER}>`,
          to: process.env.SMTP_TO,
          subject: `[홈페이지 문의] ${company_name} - ${contact_person}`,
          html: buildEmailHtml({
            company_name,
            contact_person,
            position,
            phone_number,
            email,
            inquiry_content,
          }),
        });
      } catch (mailError) {
        console.error('[문의 이메일 발송 실패]', mailError);
      }
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
