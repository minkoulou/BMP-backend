import { configDotenv } from "dotenv";
import { Prisma } from "../generated/prisma/client";

const prisma = new PrismaClient();

export { prisma }

