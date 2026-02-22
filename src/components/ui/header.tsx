"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">항공권 핫딜 트래커</h1>
        <div>
          {session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Google 로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
