import { Telegraf } from "telegraf";
import { env } from "~/env";

export const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);

bot.start(async (ctx) => {
  await ctx.reply("Привет, это стартовое сообщение", {
    parse_mode: "MarkdownV2",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Начать",
            web_app: {
              url: `${env.NEXTAUTH_URL}`,
            },
          },
        ],
      ],
    },
  });

  // Устанавливаем кнопку слева от сообщения
  await ctx.setChatMenuButton({
    text: "Начать",
    type: "web_app",
    web_app: {
      url: env.NEXTAUTH_URL,
    },
  });
});

export async function isBotAdmin(channelId: string) {
  const me = await bot.telegram.getMe();

  try {
    const member = await bot.telegram.getChatMember(channelId, me.id);
    return ["creator", "administrator"].includes(member.status);
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function isUserSubscribtion(data: {
  channelId: string;
  userId: string;
}) {
  const member = await bot.telegram.getChatMember(
    data.channelId,
    parseInt(data.userId),
  );

  const channel = await bot.telegram.getChatMembersCount(data.channelId)
  console.log(channel)
  return ["creator", "administrator", "member"].includes(member.status);
}

