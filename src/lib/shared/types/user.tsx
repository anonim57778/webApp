import { inferProcedureOutput } from "@trpc/server";
import { Router } from "~/server/api/main";



export type User = inferProcedureOutput<Router["user"]["getAll"]>[number];