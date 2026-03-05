import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const token_hash = request.nextUrl.searchParams.get("token_hash");

  if (token_hash) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: "email",
    });

    if (error) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return response;
}