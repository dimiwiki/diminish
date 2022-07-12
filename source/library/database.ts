import { PrismaClient } from "@prisma/client";
import IORedis from "ioredis";

export const redis: IORedis = new IORedis(process['env']['CACHE_DATABASE_URL']);

export const prisma: PrismaClient = new PrismaClient();