import { NextResponse } from "next/server";
import { getCertificateByCode } from "@/lib/db/repository";

export async function GET(
  req: Request,
  props: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await props.params;
    if (!code) {
      return NextResponse.json({ error: "Code parameter is required" }, { status: 400 });
    }

    const cert = getCertificateByCode(code);
    if (!cert) {
      return NextResponse.json(
        { verified: false, error: "Certificate not found or unverified" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      verified: !cert.revoked,
      revoked: cert.revoked,
      revoked_reason: cert.revoked_reason,
      certificate: cert,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Verification lookup failed" }, { status: 500 });
  }
}
