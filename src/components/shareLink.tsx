import { api } from "~/trpc/main/react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { env } from "~/env";
import { shareURL } from "@telegram-apps/sdk-react";

export default function ShareLink() {
    const [session] = api.user.session.useSuspenseQuery();

    const onCLick = () => {
        shareURL(`${env.NEXT_PUBLIC_TELEGRAM_BOT_URL}?startapp=${session.telegramId}`)
        toast.info("Ссылка скопирована в буфер обмена");
    }

    return (
        <Button onClick={onCLick} className="bg-secondary">
            Поделиться ссылкой
        </Button>
    )
}