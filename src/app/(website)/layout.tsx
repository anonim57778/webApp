"use client";

import {
  SDKProvider,
  useLaunchParams,
  useMiniApp,
  useViewport,
} from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";
import { SetInitData, SetStartParam } from "~/trpc/main/react";
import LoadingPage from "../loading";

// BASE64 зашифрованные "IOS" и "Android"
const ALLOWED_PLATFORMS = ["aW9z", "YW5kcm9pZA=="];

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SDKProvider>
      <WebsiteLayoutInner>{children}</WebsiteLayoutInner>
    </SDKProvider>
  );
}

function WebsiteLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const miniApp = useMiniApp(true);
  const launchParams = useLaunchParams(true);
  const viewport = useViewport(true);

  // Инициализируем Mini App и красим верхнюю шторку
  useEffect(() => {
    if (!miniApp) return;
    miniApp.setHeaderColor("#000000");
  }, [miniApp]);

  // Открываем Mini app на весь экран
  useEffect(() => {
    viewport?.expand();
  }, [viewport]);

  useEffect(() => {
    if (!window || !launchParams) return;
    const { initDataRaw, startParam } = launchParams;

    // Добавляем в Header авторизации initData
    if (initDataRaw) {
      SetInitData(initDataRaw);
      SetStartParam(startParam);
      setLoading(false);
    }
  }, [launchParams]);

  if (loading) {
    return <LoadingPage />;
  }

  if (
    launchParams &&
    !ALLOWED_PLATFORMS.includes(
      Buffer.from(launchParams?.platform ?? "INVALID").toString("base64"),
    )
  ) {
    return <p>Играть можно только на телефоне</p>;
  }

  return children;
}
