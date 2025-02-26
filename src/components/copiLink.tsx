import { api } from "~/trpc/main/react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { env } from "~/env";

export default function CopiLink() {
    const [session] = api.user.session.useSuspenseQuery();

    const onCLick = () => {
        window.navigator.clipboard.writeText(`${env.NEXT_PUBLIC_TELEGRAM_BOT_URL}?startapp=${session.telegramId}`)
        toast.info("Ссылка скопирована в буфер обмена");
    }

    return (
        <Button onClick={onCLick} className="bg-secondary">
            Скопировать ссылку
        </Button>
    )
}