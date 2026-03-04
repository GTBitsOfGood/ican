import { z } from "zod";
import { objectIdSchema } from "./commonSchemaUtil";
import { GameName, GameResult } from "@/types/games";

export const recordGameResultSchema = z.object({
  userId: objectIdSchema("UserId"),
  gameName: z.nativeEnum(GameName),
  result: z.nativeEnum(GameResult),
});

export const getGameStatisticsSchema = z.object({
  userId: objectIdSchema("UserId"),
});

export const validateRecordGameResult = (data: unknown) => {
  return recordGameResultSchema.parse(data);
};

export const validateGetGameStatistics = (data: unknown) => {
  return getGameStatisticsSchema.parse(data);
};
