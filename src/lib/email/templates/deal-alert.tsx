import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { DealType } from "@/types/deal";

const DEAL_TYPE_LABELS: Record<DealType, string> = {
  price_drop: "가격 하락",
  under_target: "목표 가격 도달",
  all_time_low: "역대 최저가",
};

const DEAL_TYPE_EMOJI: Record<DealType, string> = {
  price_drop: "📉",
  under_target: "🎯",
  all_time_low: "🏆",
};

interface DealAlertEmailProps {
  dealType: DealType;
  price: string; // 포맷된 KRW 문자열
  route: string; // "ICN → NRT"
  dropRate?: number;
  airline?: string;
  bookingUrl?: string;
}

export function DealAlertEmail({
  dealType,
  price,
  route,
  dropRate,
  airline,
  bookingUrl,
}: DealAlertEmailProps) {
  const label = DEAL_TYPE_LABELS[dealType];
  const emoji = DEAL_TYPE_EMOJI[dealType];

  return (
    <Html lang="ko">
      <Head />
      <Preview>
        {emoji} {label} - {route} {price}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            {emoji} {label}
          </Heading>

          <Section style={infoSection}>
            <Text style={routeText}>{route}</Text>
            <Text style={priceText}>{price}</Text>

            {dropRate && <Text style={detailText}>하락률: {dropRate}%</Text>}
            {airline && <Text style={detailText}>항공사: {airline}</Text>}
          </Section>

          {bookingUrl && (
            <Section style={buttonSection}>
              <Link href={bookingUrl} style={button}>
                예약하러 가기
              </Link>
            </Section>
          )}

          <Text style={footer}>Flight Deal Tracker에서 발송된 알림입니다.</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "480px",
  borderRadius: "8px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
  color: "#1a1a1a",
  margin: "0 0 24px",
};

const infoSection = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const routeText = {
  fontSize: "18px",
  color: "#4a5568",
  margin: "0 0 8px",
};

const priceText = {
  fontSize: "32px",
  fontWeight: "bold" as const,
  color: "#e53e3e",
  margin: "0 0 12px",
};

const detailText = {
  fontSize: "14px",
  color: "#718096",
  margin: "4px 0",
};

const buttonSection = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const button = {
  backgroundColor: "#3182ce",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};

const footer = {
  fontSize: "12px",
  color: "#a0aec0",
  textAlign: "center" as const,
  marginTop: "32px",
};

export default DealAlertEmail;
